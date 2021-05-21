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
    'module.cloudtrail.aws_cloudtrail.cloudtrail\[0\]' \
    'aws_cloudtrail.cloudtrail[0]' \
    'CloudTrail trail'
  fuzzy_move_state \
    'module.cloudtrail.null_resource.dependency_getter' \
    'null_resource.dependency_getter' \
    'null_resource'
  fuzzy_move_state \
    'module.cloudtrail.null_resource.dependency_getter' \
    'null_resource.dependency_getter' \
    'cloudtrail null_resource'
  fuzzy_move_state \
    'module.cloudtrail.module.bucket.null_resource.dependency_getter' \
    'module.bucket.null_resource.dependency_getter' \
    'bucket null_resource'
  fuzzy_move_state \
    'module.cloudtrail.module.bucket.aws_s3_bucket.cloudtrail_with_logs_archived\[0\]' \
    'module.bucket.module.private_bucket.aws_s3_bucket.bucket[0]' \
    'CloudTrail bucket'
  fuzzy_move_state \
    'module.cloudtrail.module.bucket.aws_s3_bucket_public_access_block.public_access_trail\[0\]' \
    'module.bucket.module.private_bucket.aws_s3_bucket_public_access_block.public_access[0]' \
    'CloudTrail bucket public access'
  fuzzy_move_state \
    'module.cloudtrail.module.bucket.aws_s3_bucket_policy.cloudtrail_access_policy\[0\]' \
    'module.bucket.module.private_bucket.aws_s3_bucket_policy.bucket_policy[0]' \
    'CloudTrail bucket policy'

  local -r original_key_addr="module.cloudtrail.module.bucket.module.cloudtrail_cmk.aws_kms_alias.master_key"
  local key_name=$(terragrunt state list | grep "$original_key_addr" | grep -oE '\[".*"\]' | tr -d '"[]')
  if [[ "$key_name" == "" ]]; then
    log "Unable to find key in terraform state. Skipping cloudtrail key migration."
  else
    fuzzy_move_state \
      "module.bucket.module.cloudtrail_cmk.aws_kms_alias.master_key\[\"$key_name\"\]" \
      "module.bucket.module.cloudtrail_cmk.aws_kms_alias.master_key[\"$key_name\"]" \
      'CloudTrail kms key alias'
    fuzzy_move_state \
      "module.bucket.module.cloudtrail_cmk.aws_kms_key.master_key\[\"$key_name\"\]" \
      "module.bucket.module.cloudtrail_cmk.aws_kms_key.master_key[\"$key_name\"]" \
      'CloudTrail kms key'
    fuzzy_move_state \
      "module.cloudtrail.module.bucket.module.cloudtrail_cmk.null_resource.dependency_getter\[\"$key_name\"\]" \
      "module.bucket.module.cloudtrail_cmk.null_resource.dependency_getter[\"$key_name\"]" \
      'CloudTrail kms null_resource'

  fi
}

run "$@"
