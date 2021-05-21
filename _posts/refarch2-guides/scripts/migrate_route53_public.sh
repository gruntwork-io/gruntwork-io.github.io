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

  local -r original_addr="aws_route53_zone.primary_domain"
  local public_domain_name
  public_domain_name="$(extract_attribute $original_addr "resource.$original_addr" "name")"

  if [[ "$public_domain_name" == "" ]]; then
    log "Unable to find domain in terraform state. Skipping domain name migration."
  else
    # Move the dns record to the new map location
    fuzzy_move_state \
      'aws_route53_zone.primary_domain$' \
      "aws_route53_zone.public_zones[\"$public_domain_name\"]" \
      'Route53 Zone'
  fi
}

run "$@"
