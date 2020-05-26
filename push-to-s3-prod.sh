#!/bin/bash

set -e

JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config.prod.yml
s3_website push --config-dir config/prod
