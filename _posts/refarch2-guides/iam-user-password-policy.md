# iam-user-password-policy service migration guide

**NOTE: There is no service catalog module for setting an IAM user password policy, but the library module (`[iam-user-password-policy](https://github.com/gruntwork-io/terraform-aws-security/blob/master/modules/iam-user-password-policy/)`) is designed to be deployed directly, like a Service Catalog module.**

## Estimated Time to Migrate: 5 minutes per environment

## New Outputs

The `iam-user-password-policy` module in `terraform-aws-security` defines several new outputs that did not previously exist. Refer to [`outputs.tf`](https://github.com/gruntwork-io/terraform-aws-security/blob/v0.46.6/modules/iam-user-password-policy/outputs.tf).

## State Migration Script

Run the provided migration script (contents pasted below for convenience) to migrate the state in a backward compatible way:

```
terragrunt state mv module.password_policy.aws_iam_account_password_policy.main 'aws_iam_account_password_policy.main[0]'
```

## Breaking Changes

This change is fully backward compatible, provided the state migration command above is run.
