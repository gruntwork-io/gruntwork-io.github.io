# memcached service migration guide

Follow this guide to update the memcached service to the Service Catalog.

## Estimated Time to Migrate: 10 minutes per environment

## New Required Inputs

Configure these new inputs to migrate to the Service Catalog version of the module. They are now required.


- `vpc_id`: Set this to the ID of the VPC where the memcached service should be deployed. This should be pulled in using a `dependency` block against the `vpc-app service`, using the `vpc_id` output.
- `subnet_ids`: Set this to the list of IDs of the VPC subnet where the memcached service should be deployed. This should be pulled in using a `dependency` block against the `vpc-app` service, using the `private_persistence_subnet_ids` output.

## Inputs for Backward Compatibility

Configure the following new inputs to ensure your service continues to function with minimal interruption. These are necessary to maintain backward compatibility. *If left unset, you will risk redeploying the service and causing downtime.*

- `allow_connections_from_cidr_blocks`: Set this to the list of CIDR blocks that should have access to Memcached. This should be the CIDR blocks of the private-app layer of the VPC. This should be pulled in using a `dependency` block against the `vpc-app` service, using the `private_app_subnet_cidr_blocks` output.
- alarms_sns_topic_arns: Set this to the ARN of the SNS topic where CloudWatch alarm alerts should be sent. This should be pulled in using a `dependency` block against the `sns-topics` service using the `topic_arn` output.
- `enable_cloudwatch_alarms`: A boolean that configures whether or not to enable CloudWatch alarms. For backward compatibility, set this to `true`.


## Breaking Changes

This change is fully backward compatible.
