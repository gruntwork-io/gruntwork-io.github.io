FROM ruby:2.4.2
MAINTAINER Gruntwork <info@gruntwork.io>

# Copy the Gemfile and Gemfile.lock into the image and run bundle install in a
# way that will be cached
WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install

RUN curl -sSL https://github.com/jgm/pandoc/releases/download/2.2.3.2/pandoc-2.2.3.2-1-amd64.deb -o/tmp/pandoc.deb && \
    dpkg -i /tmp/pandoc.deb && \
    rm -f /tmp/pandoc.deb

# Install Java, which is required for s3_website, and then install s3_website
RUN apt-get update && \
    apt-get install -y default-jre && \
    rm -rf /var/lib/apt/lists/*
RUN s3_website install

RUN apt-get update && \
    apt-get install -y texlive texlive-xetex texlive-latex-recommended texlive-latex-extra texlive-lang-cjk

# Install Pandoc
RUN wget https://github.com/jgm/pandoc/releases/download/2.2.3.2/pandoc-2.2.3.2-1-amd64.deb
RUN dpkg -i pandoc-2.2.3.2-1-amd64.deb

# Copy source
RUN mkdir -p /src
VOLUME ["/src"]
WORKDIR /src
COPY . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Run jekyll serve - jekyll will build first to create a plain html file for TOS update
CMD ["./jekyll-serve.sh"]
