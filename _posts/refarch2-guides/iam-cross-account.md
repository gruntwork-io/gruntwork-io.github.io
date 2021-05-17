# iam-cross-account service migration guide

**NOTE: There is no service catalog module for `cross-account-iam-roles`, but the library module (`[cross-account-iam-roles](https://github.com/gruntwork-io/terraform-aws-security/blob/master/modules/cross-account-iam-roles/)`) is designed to be deployed directly, like a Service Catalog module.**

## Estimated Time to Migrate: 10 minutes per environment


## Inputs and Outputs

No inputs nor outputs have changed with this update.

## State Migration Script

Run the provided migration script (contents pasted below for convenience) to migrate the state in a backward compatible way:

TODO

## Breaking Changes

This update is fully backward compatible.

Note that permissions have been added to several IAM policies. Be sure to review these to make sure you understand what permissions are changing. No permissions have been removed.
