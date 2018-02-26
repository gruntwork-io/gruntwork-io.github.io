# ---------------------------------------------------------------------------------------------------------------------
# CREATE AN S3 BUCKET AND CLOUDFRONT DISTRIBUTION FOR THE GRUNTWORK.IO WEBSITE
# ---------------------------------------------------------------------------------------------------------------------

provider "aws" {
  region              = "us-east-1"
}

terraform {
  backend "s3" {
    bucket         = "gruntwork-website-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE STATIC WEBSITE
# ---------------------------------------------------------------------------------------------------------------------

module "static_website" {
  source = "git::git@github.com:gruntwork-io/package-static-assets.git//modules/s3-static-website?ref=v0.1.0"

  website_domain_name = "${var.domain_name}"

  index_document = "${var.index_document}"
  error_document = "${var.error_document}"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A REDIRECT BUCKET
# This bucket just redirects non-www traffic to the www domain.
# ---------------------------------------------------------------------------------------------------------------------

module "redirect" {
  source = "git::git@github.com:gruntwork-io/package-static-assets.git//modules/s3-static-website?ref=v0.1.0"

  website_domain_name          = "gruntwork.io"
  should_redirect_all_requests = true
  redirect_all_requests_to     = "${module.static_website.website_domain_name}"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE CLOUDFRONT WEB DISTRIBUTION
# ---------------------------------------------------------------------------------------------------------------------

module "cloudfront" {
  source = "git::git@github.com:gruntwork-io/package-static-assets.git//modules/s3-cloudfront?ref=v0.1.0"

  bucket_name                 = "${var.domain_name}"
  bucket_website_endpoint     = "${module.static_website.website_bucket_endpoint}"
  s3_bucket_is_public_website = true

  index_document     = "${var.index_document}"
  error_document_404 = "${var.error_document}"
  error_document_500 = "${var.error_document}"

  min_ttl     = 0
  max_ttl     = 600
  default_ttl = 300

  # Note: We configure the alias and TLS cert here, but the domain name is managed in the Phoenix DevOps account!!
  domain_names           = ["www.gruntwork.io", "gruntwork.io"]
  acm_certificate_arn    = "${data.aws_acm_certificate.cert.arn}"
  viewer_protocol_policy = "redirect-to-https"
}

# ---------------------------------------------------------------------------------------------------------------------
# FIND THE ACM CERTIFICATE
# ---------------------------------------------------------------------------------------------------------------------

data "aws_acm_certificate" "cert" {
  domain   = "*.gruntwork.io"
  statuses = ["ISSUED"]
}
