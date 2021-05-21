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

  # allow auto deploy role
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_auto_deploy_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_auto_deploy_access_from_other_accounts[0]' \
    'Auto Deploy role'
  # allow auto deploy policy
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_auto_deploy_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_auto_deploy_access_from_other_accounts[0]' \
    'Auto Deploy policy'

  # allow billing role
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_billing_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_billing_access_from_other_accounts[0]' \
    'Billing role'
  # allow billing policy
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_billing_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_billing_access_from_other_accounts[0]' \
    'Billing policy'

  # dev role
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_dev_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_dev_access_from_other_accounts[0]' \
    'Dev access role'
  # dev policy
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_dev_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_dev_access_from_other_accounts[0]' \
    'Dev policy'

  # full access role
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_full_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_full_access_from_other_accounts[0]' \
    'Full access role'
  # full access policy
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_full_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_full_access_from_other_accounts[0]' \
    'Full access policy'

  # read only role
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_read_only_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_read_only_access_from_other_accounts[0]' \
    'Read only access role'
  # read only policy
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_read_only_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_read_only_access_from_other_accounts[0]' \
    'Read only access policy'

  # ssh iam access role (security account only)
  fuzzy_move_state \
    'module\..*.aws_iam_role.allow_ssh_iam_access_from_other_accounts\[0\]' \
    'aws_iam_role.allow_ssh_iam_access_from_other_accounts[0]' \
    'IAM access role'
  # ssh-grunt access policy (security account only)
  fuzzy_move_state \
    'module\..*.aws_iam_role_policy.allow_ssh_grunt_access_from_other_accounts\[0\]' \
    'aws_iam_role_policy.allow_ssh_grunt_access_from_other_accounts[0]' \
    'IAM ssh-grunt access policy'
}

run "$@"
