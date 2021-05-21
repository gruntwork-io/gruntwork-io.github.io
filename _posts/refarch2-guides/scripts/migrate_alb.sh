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

  local -r original_addr="aws_route53_zone.dns_record"
  local domain_name
  domain_name="$(extract_attribute $original_addr "resource.$original_addr" "name")"
  if [[ "$domain_name" == "" ]]; then
    log "Unable to find domain in terragrunt.hcl. Skipping domain name migration."
  else
    # Move the dns record to the new map location
    fuzzy_move_state \
      'aws_route53_record.dns_record$' \
      "aws_route53_record.dns_record[\"$domain_name\"]" \
      'DNS record'
  fi

  # Move the access logs bucket and policy to the new state location
  fuzzy_move_state \
    'module.alb_access_logs_bucket.aws_s3_bucket.access_logs_with_logs_archived_and_deleted$' \
    'module.alb_access_logs_bucket.module.access_logs.aws_s3_bucket.bucket[0]'
    'ALB Access Logs bucket'
}

run "$@"
