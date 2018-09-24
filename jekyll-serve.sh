#!/bin/bash

set -e

echo -e "\e[1;31mBuild Jekyll for Pandoc to make new ToS Docx"
bundle exec jekyll build
bundle exec pandoc -s --from html _site/terms/word.html --reference-doc=reference.docx -o Gruntwork-TermsOfService.docx
echo -e "\e[1;32mNew TOS Document (Gruntwork-TermsOfService.docx) File Generated"
echo -e "\e[1;31mRun Jekyll serve to watch for changes"
bundle exec jekyll serve --drafts --incremental --host 0.0.0.0
