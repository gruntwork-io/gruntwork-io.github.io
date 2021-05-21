#!/usr/bin/env bash
# This script contains the state migration instructions for migrating route53-public to the Service Catalog from the old
# style Gruntwork Reference Architecture. Install this script and run it from the terragrunt live configuration
# directory of the module to perform the state operations.


set -e
set -o pipefail

# Import the helper functions from the repo root.
readonly infra_live_repo_root="$(git rev-parse --show-toplevel)"
source "$infra_live_repo_root/_scripts/migration_helpers.sh"

function migrate_alb_listener {
  local -r port_mapping="$1"

  local -r old_listener_rule_addr_base='aws_alb_listener_rule.paths_to_route_to_this_service'
  local -r new_listener_rule_addr_base='module.listener_rules.aws_lb_listener_rule.forward'
  local new_listener_rule_addr
  local addr_index
  local target_port

  if [[ "$port_mapping" =~ ([0-9])+=([0-9]+) ]]; then
    addr_index="${BASH_REMATCH[1]}"
    target_port="${BASH_REMATCH[2]}"
    new_listener_rule_addr="${new_listener_rule_addr_base}[\"main-$target_port\"]"
    fuzzy_import_move_state \
      "$old_listener_rule_addr_base\\[$addr_index\\]" \
      "$new_listener_rule_addr" \
      "resource.$old_listener_rule_addr_base" \
      'listener rule'
  else
    log "ERROR: Invalid ALB port mapping: $port_mapping"
    log 'ERROR: Should be in the form OLD_ADDR_INDEX=PORT (e.g., 0=80)'
  fi
}

function run {
  assert_hcledit_is_installed
  assert_jq_is_installed
  local -r server_port_key="$1"

  shift
  local -a server_alb_port_mapping=("$@")

  if [[ -z "$server_port_key" ]]; then
    log 'ERROR: You must provide the key to use for the target group (the key of the entry in inputs.server_ports).'
    log 'ERROR: Usage: ./migrate.sh SERVER_PORT_KEY SERVER_ALB_PORT_MAPPING...'
    log 'NOTE: SERVER_ALB_PORT_MAPPING should be in the form OLD_ADDR_INDEX=PORT (e.g., 0=80)'
    exit 1
  fi

  assert_hcledit_is_installed
  assert_jq_is_installed

  fuzzy_move_state 'aws_alb_target_group.service' "aws_alb_target_group.service[\"$server_port_key\"]" 'ALB Target Group'

  # Import the security group rule to avoid a terraform error
  local -r new_egress_rule_addr='aws_security_group_rule.egress_all'
  if terragrunt state show "$new_egress_rule_addr" >/dev/null 2>&1; then
    log 'Egress security group rule already imported. Skipping import step.'
  else
    log 'Importing egress security group rule'
    local addr
    addr="$(find_state_address 'aws_security_group.lc_security_group')"
    local security_group_id
    security_group_id="$(extract_attribute "$addr" 'resource.aws_security_group.lc_security_group' 'id')"
    local -r egress_rule_id="${security_group_id}_egress_-1_0_0_0.0.0.0/0"
    terragrunt import aws_security_group_rule.egress_all "$egress_rule_id"
  fi

  # Migrate the listener rules to the new module address
  for port_mapping in "${server_alb_port_mapping[@]}"; do
    migrate_alb_listener "$port_mapping"
  done
}

run "$@"
