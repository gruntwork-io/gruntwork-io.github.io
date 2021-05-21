#!/usr/bin/env bash
# This script contains the state migration instructions for migrating VPCs to the Service Catalog from the old
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
    'mgmt_vpc_peering_connection.aws_vpc_peering_connection.vpc_peering_connection' \
    'module.vpc_peering_connection.aws_vpc_peering_connection.vpc_peering_connection[0]' \
    'VPC Peering Connection'

  fuzzy_move_state \
    'mgmt_vpc_peering_connection.aws_vpc_peering_connection_options.vpc_peering_connection_options' \
    'module.vpc_peering_connection.aws_vpc_peering_connection_options.vpc_peering_connection_options[0]' \
    'VPC Peering Connection Options'

  fuzzy_move_list \
    'mgmt_vpc_peering_connection.aws_route.origin_to_destination' \
    'vpc_peering_connection.aws_route.origin_to_destination' \
    'VPC Peering Route - Origin to Destination'

  fuzzy_move_list \
    'mgmt_vpc_peering_connection.aws_route.destination_to_origin' \
    'vpc_peering_connection.aws_route.destination_to_origin' \
    'VPC Peering Route - Destination to Origin'
}

run "$@"
