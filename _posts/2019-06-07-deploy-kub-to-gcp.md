---
layout: post
title: Deploying a Kubernetics App on GCP
logoUrl: /assets/img/guides/kubernetics_image.png
excerpt: Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic Node.js app that responds to requests on port 8080.
prerequisiteTitle: In order to follow this guide, you will need
prerequisite:
 - listItem: A GCP account with billing enabled. There is a free tier that includes $300 of free credit over a 12 month period.
 - listItem: Terraform v0.10.3 or later installed locally.
 - listItem: Docker v18.09.2 or later installed locally.
 - listItem: A recent version of the gcloud command-line tool.
 - listItem: A basic understanding of Node.js is also recommended.
toc: true
---

## Testing
Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic Node.js app that responds to requests on port 8080.
Start by creating a file called server.js and paste in the following source code:
Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic 

## Test 2
Node.js app that responds to requests on port 8080.
Start by creating a file called server.js and paste in the following source code:Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic Node.js app that responds to requests on port 8080.
Start by creating a file called server.js and paste in the following source code:
![My helpful screenshot](/assets/img/guides/code-block.png)

Next, we need a simple package.json file in order to make this work properly:
![My helpful screenshot](/assets/img/guides/code-block.png)

Before we can deploy a dockerized app, we need to first create one. For the purposes of this guide we will create a basic Node.js app that responds to requests on port 8080.
Start by creating a file called server.js and paste in the following source code:
![My helpful screenshot](/assets/img/guides/code-block.png)

Next, we need a simple package.json file in order to make this work properly:
![My helpful screenshot](/assets/img/guides/code-block.png)