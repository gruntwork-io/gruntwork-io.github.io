# sns-topics Service Catalog Migration Guide

Follow this guide to update the `sns-topics` module to the Service Catalog.

## Estimated Time to Migrate: 10 minutes per environment

## Renamed Outputs

Update downstream dependency references to use the new names of these outputs, which were renamed in the Service Catalog version of the module.

- `arn` ⇒ `topic_arn`
