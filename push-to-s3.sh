#!/bin/bash

set -e

JEKYLL_ENV=production bundle exec jekyll build
s3_website push
