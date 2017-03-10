#!/bin/bash

set -e

bundle exec jekyll serve --config _config.yml,_config.dev.yml --drafts --incremental --host 0.0.0.0
