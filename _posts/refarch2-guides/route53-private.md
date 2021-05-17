# Route 53 (private) Migration Guide

Follow this guide to update the route53-private service to the Service Catalog.

## Estimated Time to Migrate: 5-10 minutes per environment

## New Required Inputs

Configure these new inputs to migrate to the Service Catalog version of the module. They are now required.

- `private_zones`*:* For route53-private, you must define the domain in a `private_zones` map. The VPC ID should be retrieved with a `dependency` block. For a backward compatible update, use the following map configuration:

```
private_zones = {
    "example.com" = {
      vpc_id = dependency.vpc.outputs.vpc_id
      comment = "Managed by Terraform"
      tags = {}
      force_destroy = false
    }
}
```

## Removed Inputs

Remove the following inputs as they are not present in the Service Catalog version of the module:

- `internal_services_domain_name`: This input in route53-private has been removed and replaced with a new input, `private_zones`, described above.

## Output Changes

Update downstream dependency references to use the new names of these outputs, which were renamed in the Service Catalog version of the module.

- `internal_services_domain_name`: This output in route53-private has been removed and replaced with a new output, `private_domain_names`, which is a list of domain names. If your `private_zones` map contains only one domain, this output will have only one element.
- `internal_services_hosted_zone_id`: This output in route53-private has been removed and replaced with a new output, `private_zones_ids`, which is a list of zone IDs. If your `private_zones` map contains only one domain, this output will have only one element.
- `internal_services_name_servers`: This output in route53-private has been removed and replaced with a new output, `private_zones_name_servers`, which is a list of lists, where each element of the list is a list of name servers for a domain in the list of `private_domain_names`.  If your `private_zones` map contains only one domain, this output will have only one element.

## State Migration Script

Run the provided migration script (contents pasted below for convenience) to migrate the state in a backward compatible way:

```python
#!/bin/bash
# This script contains the state migration instructions for migrating albs to the Service Catalog from the old
# style Gruntwork Reference Architecture. Install this script and run it from the terragrunt live configuration
# directory of the module to perform the state operations.
#

set -e
set -o pipefail

# Import the helper functions from the repo root.
readonly infra_live_repo_root="$(git rev-parse --show-toplevel)"
source "$infra_live_repo_root/_scripts/migration_helpers.sh"

function run {
  local internal_domain_name=$(grep -E '^\s*internal_services_domain_name\s*=\s*' terragrunt.hcl | grep -oE '".*"' | tr -d '"')
  if [[ "$internal_domain_name" == "" ]]; then
    log "Unable to find domain in terragrunt.hcl. Skipping domain name migration."
  else
    # Move the dns record to the new map location
    fuzzy_move_state \
      'aws_route53_zone.internal_services$' \
      "aws_route53_zone.private_zones[\"$internal_domain_name\"]" \
      'Route53 Zone'
  fi
}

run "$@"
```

## Breaking Changes

- This change is fully backward compatible. You will notice the creation of a `null_resource` in the plan and apply. This can be safely ignored.
