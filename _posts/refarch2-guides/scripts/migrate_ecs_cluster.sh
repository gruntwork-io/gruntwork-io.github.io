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
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb\[0\]' \
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb[2]' \
    'Ingress security group rule from ALB (tmp)'
  fuzzy_move_state \
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb\[1\]' \
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb[0]' \
    'Ingress security group rule from ALB (swap)'
  fuzzy_move_state \
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb\[2\]' \
    'module.ecs_cluster.aws_security_group_rule.allow_inbound_from_alb[1]' \
    'Ingress security group rule from ALB (swap)'
}

run "$@"
