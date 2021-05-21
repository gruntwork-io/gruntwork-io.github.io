#!/usr/bin/env bash
# This script contains the state migration instructions for migrating route53-public to the Service Catalog from the old
# style Gruntwork Reference Architecture. Install this script and run it from the terragrunt live configuration
# directory of the module to perform the state operations.


set -e
set -o pipefail

# Import the helper functions from the repo root.
readonly infra_live_repo_root="$(git rev-parse --show-toplevel)"
source "$infra_live_repo_root/_scripts/migration_helpers.sh"

function run {
  assert_hcledit_is_installed
  assert_jq_is_installed

  fuzzy_move_state \
    'fluentbit_cloudwatch.helm_release.aws_for_fluent_bit' \
    'module.aws_for_fluent_bit.helm_release.aws_for_fluent_bit' \
    'AWS for Fluent Bit'

  fuzzy_move_state \
    'fluentbit_cloudwatch.null_resource.dependency_getter' \
    'module.aws_for_fluent_bit.null_resource.dependency_getter' \
    'AWS for Fluent Bit dependency getter'

  local original_addr
  original_addr="$(find_state_address "helm_release.aws_alb_ingress_controller")"
  if [[ -z "$original_addr" ]]; then
    log "helm_release.aws_alb_ingress_controller is already removed. Skipping removal."
    return
  fi
  terragrunt state rm "$original_addr"
}

run "$@"
