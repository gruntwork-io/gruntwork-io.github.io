FROM ruby:2.6.2-stretch
MAINTAINER Gruntwork <info@gruntwork.io>

# Copy the Gemfile and Gemfile.lock into the image and run bundle install in a way that will be cached
WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install

# Install Java, which is required for s3_website
# Install texlive libraries, which are required for Pandoc
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get install -y texlive texlive-xetex texlive-latex-recommended texlive-latex-extra texlive-lang-cjk && \
    rm -rf /var/lib/apt/lists/*

# Install s3_website, which is used to publish generated files to S3
RUN s3_website install

# Install Pandoc
RUN curl -sSL https://github.com/jgm/pandoc/releases/download/2.3/pandoc-2.3-1-amd64.deb -o/tmp/pandoc.deb && \
    dpkg -i /tmp/pandoc.deb && \
    rm -f /tmp/pandoc.deb

# Copy source
RUN mkdir -p /src
VOLUME ["/src"]
WORKDIR /src
COPY . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Run jekyll serve - jekyll will build first to create a plain html file for TOS update
CMD ["./jekyll-serve.sh"]
