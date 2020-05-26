#!/bin/bash

set -e

JEKYLL_ENV=development bundle exec jekyll build --config _config.yml,_config.stage.yml
s3_website push --config-dir config/stage
