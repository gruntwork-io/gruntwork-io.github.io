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

  local -r original_key_addr="module.kms_master_key.aws_kms_key.master_key"
  local key_name=$(terragrunt state list | grep "$original_key_addr" | head -1 | grep -oE '\[".*"\]' | tr -d '"[]')
  if [[ "$key_name" == "" ]]; then
    log "Unable to find key in terraform state. Skipping key migration."
  else
    # Move the key to the new location in state
    fuzzy_move_state \
      "$original_key_addr\[\"$key_name\"\]" \
      "aws_kms_key.master_key[\"$key_name\"]" \
      'KMS CMK'

    # Move the key alias to the new location in state
    fuzzy_move_state \
      "module.kms_master_key.aws_kms_alias.master_key\[\"$key_name\"\]" \
      "aws_kms_alias.master_key[\"$key_name\"]" \
      'KMS key alias'

    # Move the null_resource to new location in state
    # This is unnecessary, but makes the migration cleaner with no resources to update
    fuzzy_move_state \
      "module.kms_master_key.null_resource.dependency_getter\[\"$key_name\"\]" \
      "null_resource.dependency_getter[\"$key_name\"]" \
      'null_resource'
  fi
}

run "$@"
