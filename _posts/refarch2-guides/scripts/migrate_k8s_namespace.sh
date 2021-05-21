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
    'resource_namespace.kubernetes_namespace.namespace\[0\]' \
    'module.namespace.kubernetes_namespace.namespace[0]' \
    'K8s Namespace'

  fuzzy_move_state \
    'namespace.null_resource.dependency_getter' \
    'module.namespace.null_resource.dependency_getter' \
    'K8s Namespace dependency getter'

  fuzzy_move_state \
    'resource_namespace.module.namespace_roles.kubernetes_role.rbac_tiller_metadata_access\[0\]' \
    'module.namespace.module.namespace_roles.kubernetes_role.rbac_helm_metadata_access[0]' \
    'K8s Namespace Roles - metadata access'

  fuzzy_move_state \
    'resource_namespace.module.namespace_roles.kubernetes_role.rbac_tiller_resource_access\[0\]' \
    'module.namespace.module.namespace_roles.kubernetes_role.rbac_helm_resource_access[0]' \
    'K8s Namespace Roles - resource access'

  fuzzy_move_state \
    'resource_namespace.module.namespace_roles.kubernetes_role.rbac_role_access_all\[0\]' \
    'module.namespace.module.namespace_roles.kubernetes_role.rbac_role_access_all[0]' \
    'K8s Namespace Roles - RBAC full access'

  fuzzy_move_state \
    'resource_namespace.module.namespace_roles.kubernetes_role.rbac_role_access_read_only\[0\]' \
    'module.namespace.module.namespace_roles.kubernetes_role.rbac_role_access_read_only[0]' \
    'K8s Namespace Roles - RBAC read only access'

  fuzzy_move_state \
    'resource_namespace.module.namespace_roles.null_resource.dependency_getter' \
    'module.namespace.module.namespace_roles.null_resource.dependency_getter' \
    'K8s Namespace Roles dependency getter'
  }

run "$@"
