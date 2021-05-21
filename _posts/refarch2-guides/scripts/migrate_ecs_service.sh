#!/usr/bin/env bash
# This script contains the state migration instructions for migrating route53-public to the Service Catalog from the old
# style Gruntwork Reference Architecture. Install this script and run it from the terragrunt live configuration
# directory of the module to perform the state operations.


set -e
set -o pipefail

# Import the helper functions from the repo root.
readonly infra_live_repo_root="$(git rev-parse --show-toplevel)"
source "$infra_live_repo_root/_scripts/migration_helpers.sh"

# The following routine identifies state address changes where the resource was renamed. These are migrated with state
# mv operations.
function move_operations {
  # Move a non-list resource to list resource
  # ECS Task Role
  local -r ecs_task_role_query='module.*aws_iam_role\.ecs_task$'
  local ecs_task_role_addr
  ecs_task_role_addr="$(find_state_address "$ecs_task_role_query")"
  if [[ "$ecs_task_role_addr" != "*[0]" ]]; then
    fuzzy_move_state "$ecs_task_role_query" 'aws_iam_role.tmp_addr' 'ECS Task Role (Temp)'
    fuzzy_move_state 'aws_iam_role.tmp_addr' "${ecs_task_role_addr}[0]" 'ECS Task Role'
  else
    log 'ECS Task Role already migrated.'
  fi

  # ECS Task Execution Role
  local -r ecs_task_exec_role_query='module.*aws_iam_role\.ecs_task_execution_role$'
  local ecs_task_exec_role_addr
  ecs_task_exec_role_addr="$(find_state_address "$ecs_task_exec_role_query")"
  if [[ "$ecs_task_exec_role_addr" != "*[0]" ]]; then
    fuzzy_move_state "$ecs_task_exec_role_query" 'aws_iam_role.tmp_addr' 'ECS Task Execution Role (Temp)'
    fuzzy_move_state 'aws_iam_role.tmp_addr' "${ecs_task_exec_role_addr}[0]" 'ECS Task Execution Role'
  else
    log 'ECS Task Execution Role already migrated.'
  fi
}

function run {
  assert_hcledit_is_installed
  assert_jq_is_installed

  log 'Identifying state move operations that are necessary'
  move_operations

  local -r new_listener_rule_addr_base='module.listener_rules.aws_lb_listener_rule.forward'
  # The "main-443" is from forward_rules input variable map key.
  local -r new_listener_rule_addr="${new_listener_rule_addr_base}[\"main-443\"]"
  fuzzy_import_move_state \
    'aws_alb_listener_rule.paths_to_route_to_this_service' \
    "$new_listener_rule_addr" \
    'resource.aws_alb_listener_rule.paths_to_route_to_this_service' \
    'listener rule'
}

run "$@"
