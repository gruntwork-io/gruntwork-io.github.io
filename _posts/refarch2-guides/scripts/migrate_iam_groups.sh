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

  # Migrating from nested iam-groups module addresses to top level.

  local addresses
  addresses="$(find_state_address 'module.iam_groups')"
  local total_addrs
  total_addrs="$(echo "$addresses" | wc -l)"
  log "Found $total_addrs state addresses under module.iam_groups."

  if [[ "$total_addrs" == "0" ]]; then
    log "All state addresses migrated. Nothing to do."
    return
  fi

  local addr_without_module
  for addr in $addresses
  do
    addr_without_module="$(echo "$addr" | sed 's/^module.iam_groups.//g')"
    move_state "$addr" "$addr_without_module"
  done
}

run "$@"
