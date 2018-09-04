#!/bin/bash

set -e

bundle exec jekyll build
bundle exec pandoc -s --from html _site/terms/word.html --reference-doc=reference.docx -o Gruntwork-TermsOfService.docx && echo -e "\e[1;31mNew TOS Document (Gruntwork-TermsOfService.docx) File Generated"
bundle exec jekyll serve --drafts --incremental --host 0.0.0.0
