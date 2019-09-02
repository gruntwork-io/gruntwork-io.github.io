---
layout: post
type: guide
title: Deploying a Dockerized app on GCP and GKE
permalink: /guides/:categories/:title
image: /assets/img/guides/kubernetics_image.png
excerpt: Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic Node.js app that responds to requests on port 8080.
tags: ["gcp", "gke", "docker"]
date: 2019-05-08
categories: Docker
toc: true
---

## Prerequisite
This guide walks you through deploying a dockerized app to a GKE cluster running on Google Cloud Platform.

In order to follow this guide you will need:

1. A GCP account with billing enabled. There is a [free tier](https://cloud.google.com/free/) that includes \$300 of free credit over a 12 month period.
2. [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html) v0.10.3 or later installed locally.
3. [Docker](https://www.docker.com/) v18.09.2 or later installed locally.
4. A recent version of the [gcloud](https://cloud.google.com/sdk/gcloud/) command-line tool.
5. A basic understanding of Node.js is also recommended.

## Creating a Basic App

Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create
a basic Node.js app that responds to requests on port `8080`.

Start by creating a file called `server.js` and paste in the following source code:

```javascript
const express = require("express")

// Constants
const PORT = 8080
const HOST = "0.0.0.0"

// App
const app = express()
app.get("/", (req, res) => res.send("Hello World!"))

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
```

Next, we need a simple `package.json` file in order to make this work properly:

```json
{
  "name": "docker_web_app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.16.4"
  }
}
```

Now we can begin to Dockerize the App!

## Dockerizing the App

Before we can deploy the app to GKE, we need to first dockerize it. If you are not familiar with the basics of Docker, we recommend
you check out our "[Crash Course on Docker and Packer](https://training.gruntwork.io/p/a-crash-course-on-docker-packer)" from the Gruntwork Training Library.

For the purposes of this guide, we will use the following `Dockerfile` to package our app into a Docker image.

```docker
FROM node:12

# Create app directory
WORKDIR /usr/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
```

The folder structure of our sample app should now look like this:

```bash
├── server.js
├── Dockerfile
└── package.json
```

**Note:** Your actual app will definitely be a lot more complicated than this, but the main point to take from here, is that
we need to ensure our Docker image is configured to EXPOSE the port that our app is going to need for external
communication. See the [Docker examples](https://docs.docker.com/samples/) for more information on dockerizing popular
app formats.

To build this Docker image from the `Dockerfile`, run:

```bash
$ docker build -t simple-web-app:latest .
```

Now we can test our container to see if it is working:

```bash
$ docker run --rm -p 8080:8080 simple-web-app:latest
```

This starts the newly built container and links port 8080 on your machine to the container's port 8080. You should see
the following output below when you run the above command:

```bash
> docker_web_app@1.0.0 start /usr/app
> node server.js

Running on http://0.0.0.0:8080
```

Next, let's go and open the app in your browser:

```bash
$ open http://localhost:8080
```

You should be able to see the "Hello World!" message from the server.

### Dockerfile Tips

Some things to note when writing up your Dockerfile and building your app:

- Ensure your Dockerfile starts your app in the foreground so the container doesn't shutdown after app startup.
- Your app should log to stdout/stderr to aid in debugging it after deployment to GKE

## Pushing the Docker image

So far we've successfully built a Docker image on our local computer. Now it's time to push the image to your private
[Google Container Registry](https://cloud.google.com/container-registry/), so it can be deployed in the future.

First, we must configure our local Docker client to be able to authenticate to Container Registry. Simply, run the
following commands (Note: you'll only need to do this step once):

```bash
$ export PROJECT_ID="$(gcloud config get-value project -q)"
$ gcloud auth configure-docker
```

Next, tag the local Docker image for uploading:

```bash
$ docker tag simple-web-app:latest gcr.io/${PROJECT_ID}/simple-web-app:v1
```

Finally, push the Docker image to your private Container Registry:

```bash
$ docker push gcr.io/${PROJECT_ID}/simple-web-app:v1
```

## Launching a GKE Cluster

Now we have successfully pushed the Docker image to the private Container Registry, we need to launch a
[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) cluster. By using our
[GKE module](https://github.com/gruntwork-io/terraform-google-gke) we can easily deploy a production-grade GKE cluster.

First, let's create a `terraform` directory to store the HCL code:

```bash
$ mkdir -p terraform
$ cd terraform
```

Then create a `main.tf` file and copy the following code:

```hcl
provider "google" {
  version = "~> 2.3.0"
  project = "${var.project}"
  region  = "${var.region}"
}

provider "google-beta" {
  version = "~> 2.3.0"
  project = "${var.project}"
  region  = "${var.region}"
}

# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY A PRIVATE CLUSTER IN GOOGLE CLOUD PLATFORM
# ---------------------------------------------------------------------------------------------------------------------

module "gke_cluster" {
  # Use a recent version of the gke-cluster module
  source = "git::git@github.com:gruntwork-io/terraform-google-gke.git//modules/gke-cluster?ref=v0.1.0"

  name = "${var.cluster_name}"

  project  = "${var.project}"
  location = "${var.location}"
  network  = "${module.vpc_network.network}"

  # We're deploying the cluster in the 'public' subnetwork to allow outbound internet access
  # See the network access tier table for full details:
  # https://github.com/gruntwork-io/terraform-google-network/tree/master/modules/vpc-network#access-tier
  subnetwork = "${module.vpc_network.public_subnetwork}"

  # When creating a private cluster, the 'master_ipv4_cidr_block' has to be defined and the size must be /28
  master_ipv4_cidr_block = "${var.master_ipv4_cidr_block}"

  # This setting will make the cluster private
  enable_private_nodes = "true"

  # To make testing easier, we keep the public endpoint available. In production, we highly recommend restricting access to only within the network boundary, requiring your users to use a bastion host or VPN.
  disable_public_endpoint = "false"

  # With a private cluster, it is highly recommended to restrict access to the cluster master
  # However, for example purposes we will allow all inbound traffic.
  master_authorized_networks_config = [{
    cidr_blocks = [{
      cidr_block   = "0.0.0.0/0"
      display_name = "all-for-testing"
    }]
  }]

  cluster_secondary_range_name = "${module.vpc_network.public_subnetwork_secondary_range_name}"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A NODE POOL
# ---------------------------------------------------------------------------------------------------------------------

resource "google_container_node_pool" "node_pool" {
  provider = "google-beta"

  name     = "private-pool"
  project  = "${var.project}"
  location = "${var.location}"
  cluster  = "${module.gke_cluster.name}"

  initial_node_count = "1"

  autoscaling {
    min_node_count = "1"
    max_node_count = "5"
  }

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  node_config {
    image_type   = "COS"
    machine_type = "n1-standard-1"

    labels = {
      private-pools-example = "true"
    }

    # Add a private tag to the instances. See the network access tier table for full details:
    # https://github.com/gruntwork-io/terraform-google-network/tree/master/modules/vpc-network#access-tier
    tags = [
      "${module.vpc_network.private}",
      "private-pool-example",
    ]

    disk_size_gb = "30"
    disk_type    = "pd-standard"
    preemptible  = false

    service_account = "${module.gke_service_account.email}"

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  lifecycle {
    ignore_changes = ["initial_node_count"]
  }

  timeouts {
    create = "30m"
    update = "30m"
    delete = "30m"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A CUSTOM SERVICE ACCOUNT TO USE WITH THE GKE CLUSTER
# ---------------------------------------------------------------------------------------------------------------------

module "gke_service_account" {
  # Use a recent version of the gke-service-account module
  source = "git::git@github.com:gruntwork-io/terraform-google-gke.git//modules/gke-service-account?ref=v0.1.0"

  name        = "${var.cluster_service_account_name}"
  project     = "${var.project}"
  description = "${var.cluster_service_account_description}"
}

# ---------------------------------------------------------------------------------------------------------------------
# ALLOW THE CUSTOM SERVICE ACCOUNT TO PULL IMAGES FROM THE GCR REPO
# ---------------------------------------------------------------------------------------------------------------------

resource "google_storage_bucket_iam_member" "member" {
  bucket = "artifacts.${var.project}.appspot.com"
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${module.gke_service_account.email}"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A NETWORK TO DEPLOY THE CLUSTER TO
# ---------------------------------------------------------------------------------------------------------------------

module "vpc_network" {
  source = "git::git@github.com:gruntwork-io/terraform-google-network.git//modules/vpc-network?ref=v0.1.0"

  name_prefix = "${var.cluster_name}-network-${random_string.suffix.result}"
  project     = "${var.project}"
  region      = "${var.region}"

  cidr_block           = "${var.vpc_cidr_block}"
  secondary_cidr_block = "${var.vpc_secondary_cidr_block}"
}

# Use a random suffix to prevent overlap in network names
resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
}
```

The `main.tf` file is responsible for creating all of the GCP resources. After that let's create both the `outputs.tf`
and `variables.tf` files:

**outputs.tf**

```hcl
output "cluster_endpoint" {
  description = "The IP address of the cluster master."
  sensitive   = true
  value       = "${module.gke_cluster.endpoint}"
}

output "client_certificate" {
  description = "Public certificate used by clients to authenticate to the cluster endpoint."
  value       = "${module.gke_cluster.client_certificate}"
}

output "client_key" {
  description = "Private key used by clients to authenticate to the cluster endpoint."
  sensitive   = true
  value       = "${module.gke_cluster.client_key}"
}

output "cluster_ca_certificate" {
  description = "The public certificate that is the root of trust for the cluster."
  sensitive   = true
  value       = "${module.gke_cluster.cluster_ca_certificate}"
}
```

**variables.tf**

```hcl
# ---------------------------------------------------------------------------------------------------------------------
# REQUIRED PARAMETERS
# These variables are expected to be passed in by the operator.
# ---------------------------------------------------------------------------------------------------------------------

variable "project" {
  description = "The project ID where all resources will be launched."
}

variable "location" {
  description = "The location (region or zone) of the GKE cluster."
}

variable "region" {
  description = "The region for the network. If the cluster is regional, this must be the same region. Otherwise, it should be the region of the zone."
}

# ---------------------------------------------------------------------------------------------------------------------
# OPTIONAL PARAMETERS
# These parameters have reasonable defaults.
# ---------------------------------------------------------------------------------------------------------------------

variable "cluster_name" {
  description = "The name of the Kubernetes cluster."
  default     = "example-private-cluster"
}

variable "cluster_service_account_name" {
  description = "The name of the custom service account used for the GKE cluster. This parameter is limited to a maximum of 28 characters."
  default     = "example-private-cluster-sa"
}

variable "cluster_service_account_description" {
  description = "A description of the custom service account used for the GKE cluster."
  default     = "Example GKE Cluster Service Account managed by Terraform"
}

variable "master_ipv4_cidr_block" {
  description = "The IP range in CIDR notation (size must be /28) to use for the hosted master network. This range will be used for assigning internal IP addresses to the master or set of masters, as well as the ILB VIP. This range must not overlap with any other ranges in use within the cluster's network."
  default     = "10.5.0.0/28"
}

# For the example, we recommend a /16 network for the VPC. Note that when changing the size of the network,
# you will have to adjust the 'cidr_subnetwork_width_delta' in the 'vpc_network' -module accordingly.
variable "vpc_cidr_block" {
  description = "The IP address range of the VPC in CIDR notation. A prefix of /16 is recommended. Do not use a prefix higher than /27."
  default     = "10.3.0.0/16"
}

# For the example, we recommend a /16 network for the secondary range. Note that when changing the size of the network,
# you will have to adjust the 'cidr_subnetwork_width_delta' in the 'vpc_network' -module accordingly.
variable "vpc_secondary_cidr_block" {
  description = "The IP address range of the VPC's secondary address range in CIDR notation. A prefix of /16 is recommended. Do not use a prefix higher than /27."
  default     = "10.4.0.0/16"
}
```

**Note:** Be sure to fill in any required variables that don't have a default value.

Now we can use Terraform to create the resources:

1. Run `terraform init`.
2. Run `terraform plan`.
3. If the plan looks good, run `terraform apply`.

Terraform will begin to create the GCP resources. This process can take up to XX minutes.

## Deploying the Dockerized App

To deploy our Dockerized App on the GKE cluster, we can use the `kubectl` CLI tool to create a
[Kubernetes Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/). A Pod is the smallest deployable
object in the Kubernetes object model and will contain only our `simple-web-app` Docker image.

First, we must configure `kubectl` to use the newly created cluster:

```
$ gcloud container clusters get-credentials example-private-cluster
```

**Note**: Be sure to substitute `example-private-cluster` with the name of your GKE cluster.

Use the `kubectl run` command to create a [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
named `simple-web-app-deploy` on your cluster:

```bash
$ kubectl run simple-web-app-deploy --image=gcr.io/${PROJECT_ID}/simple-web-app:v1 --port 8080
```

To see the Pod created by the last command, you can run:

```bash
$ kubectl get pods
```

The output should look similar to the following:

```bash
NAME                                     READY     STATUS             RESTARTS   AGE
simple-web-app-deploy-7fb787c449-vgtf6   0/1       ContainerCreating  0          7s
```

Now we need to expose the app to the public internet.

## Attaching a Load Balancer

So far we have deployed the dockerized app, but it is not currently accessible from the public internet. This is because
we have not assigned an external IP address or load balancer to the Pod. We can easily achieve this, by running the
following command:

```bash
$ kubectl expose deployment simple-web-app-deploy --type=LoadBalancer --port 80 --target-port 8080
```

**Note:** GKE assigns the external IP address to the Service resource, not the Deployment.

## Cleaning Up

In order to save costs, we recommend you destroy any infrastructure you've created by following this guide.

First, delete the Kubernetes Service:

```bash
$ kubectl delete service simple-web-app-deploy
```

This will destroy the Load Balancer created during the previous step.

Next, to destroy the GKE cluster, you can simply invoke the `terraform destroy` command:

```bash
$ terraform destroy
```

**Note**: This is a destructive command that will forcibly terminate and destroy your GKE cluster!