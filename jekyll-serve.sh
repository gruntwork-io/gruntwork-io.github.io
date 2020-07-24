#!/bin/bash

set -e

bundle exec jekyll build
bundle exec jekyll serve --livereload --drafts --host 0.0.0.0
