#!/bin/bash

set -e

bundle exec jekyll build
bundle exec pandoc -s --from html _site/terms/word.html --reference-doc=assets/msword/styles.docx -o assets/msword/gruntwork-terms.docx
echo -e "\e[1;32mA new Terms of Service document (/assets/msword/gruntwork-terms.docx) has been generated."
echo -e "\e[1;31mRun Jekyll serve to watch for changes"
bundle exec jekyll serve --livereload --drafts --host 0.0.0.0
