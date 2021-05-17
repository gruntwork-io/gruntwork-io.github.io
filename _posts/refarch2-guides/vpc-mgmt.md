# Management VPC migration guide

Follow this guide to update the vpc-mgmt module to the Service Catalog.

## Estimated Time to Migrate: 10 minutes per environment

## New Required Inputs

Configure these new inputs to migrate to the Service Catalog version of the module. They are now required.

- `vpc_name`: Set this to the name of the VPC.

## Inputs for Backward Compatibility

Configure the following new inputs to ensure your service continues to function with minimal interruption. These are necessary to maintain backward compatibility. *If left unset, you will risk redeploying the service and causing downtime.*

Set the following inputs:

```hcl
  # Set the CIDR math parameters to the one used in the infrastructure-modules version of vpc-mgmt, instead of the one
  # used by the Service Catalog.
  private_subnet_bits = 5
  public_subnet_bits = 5
  subnet_spacing = 10

  # Tags to ensure that packer builds use this VPC for building AMIs. This is necessary if you plan on adopting CIS
  # compliance, where a default VPC is a violation.
  custom_tags_vpc_only = {
    "gruntwork.io/allow-packer" = "true"
  }
  public_subnet_custom_tags = {
    "gruntwork.io/allow-packer" = "true"
  }
```


## Breaking Changes

- This change is fully backward compatible. You may notice the creation of several resources: a few `aws_vpc_endpoint_route_table_association` resources and a `aws_vpc_endpoint`. This can be safely ignored.
