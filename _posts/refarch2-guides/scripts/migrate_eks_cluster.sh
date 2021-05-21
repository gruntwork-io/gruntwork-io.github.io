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

  # Avoid the Cycle Error by removing these null_resources
  local original_addr
  original_addr="$(find_state_address "wait_for_api")"
  if [[ -z "$original_addr" ]]; then
    log "null_resource.wait_for_api is already removed. Skipping removal."
    return
  fi
  terragrunt state rm "$original_addr"

  original_addr="$(find_state_address "sync_core_components")"
  if [[ -z "$original_addr" ]]; then
    log "null_resource.sync_core_components is already removed. Skipping removal."
    return
  fi
  terragrunt state rm "$original_addr"

  # Avoids the ResourceInUse error when destroying aws_launch_configuration
  local list_addresses
  list_addresses="$(find_state_address "aws_launch_configuration.eks_worker")"
  if [[ -z "$list_addresses" ]]; then
    log "EKS worker Launch Configuration already removed. Skipping removal."
    return
  fi
  for addr in $list_addresses
  do
    echo "Removing from state:"
    echo
    echo "    $addr"
    echo
    terragrunt state rm "$addr"
  done
}

run "$@"
