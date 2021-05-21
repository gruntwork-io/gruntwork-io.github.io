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
    'aws_s3_bucket.openvpn$' \
    'module.openvpn.module.backup_bucket.aws_s3_bucket.bucket[0]' \
    'Backup S3 bucket'

  fuzzy_move_state \
    'aws_s3_bucket_public_access_block.public_access$' \
    'module.openvpn.module.backup_bucket.aws_s3_bucket_public_access_block.public_access[0]' \
    'Backup S3 Bucket Public Access policy'

  fuzzy_move_state \
    'aws_cloudwatch_metric_alarm.asg_high_cpu_utilization' \
    'module.ec2_baseline.module.high_asg_cpu_usage_alarms.aws_cloudwatch_metric_alarm.asg_high_cpu_utilization[0]' \
    'High CPU Utilization Alarm'

  fuzzy_move_state \
    'aws_cloudwatch_metric_alarm.asg_high_memory_utilization' \
    'module.ec2_baseline.module.high_asg_memory_usage_alarms.aws_cloudwatch_metric_alarm.asg_high_memory_utilization[0]' \
    'High Memory Utilization Alarm'

  fuzzy_move_state \
    'aws_cloudwatch_metric_alarm.asg_high_disk_utilization' \
    'module.ec2_baseline.module.high_asg_disk_usage_root_volume_alarms.aws_cloudwatch_metric_alarm.asg_high_disk_utilization[0]' \
    'High Disk Utilization Alarm'

  fuzzy_move_state \
    'aws_iam_role_policy.ssh_grunt_permissions' \
    'module.ec2_baseline.aws_iam_role_policy.ssh_grunt_permissions[0]' \
    'SSH Grunt Permissions'
}

run "$@"
