#!/bin/bash

set -e

bundle exec jekyll serve --drafts --incremental --host 0.0.0.0
