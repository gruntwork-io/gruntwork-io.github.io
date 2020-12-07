FROM ruby:2.7.1-buster
MAINTAINER Gruntwork <info@gruntwork.io>

# Copy the Gemfile and Gemfile.lock into the image and run bundle install in a way that will be cached
WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install

# Install Java, which is required for s3_website
RUN apt-get update && \
    apt-get install -y default-jre && \
    rm -rf /var/lib/apt/lists/*

# Install s3_website, which is used to publish generated files to S3
RUN s3_website install

# Copy source
RUN mkdir -p /src
VOLUME ["/src"]
WORKDIR /src
COPY . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Run jekyll serve - jekyll will build first to create a plain html file for TOS update
CMD ["./jekyll-serve.sh"]
