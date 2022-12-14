# gruntwork.io website

This is the code for the [Gruntwork website](https://www.gruntwork.io).

Gruntwork can help you get your entire infrastructure, defined as code, in about a day. You focus on your product.
We'll take care of the Gruntwork.

## Docker quick start

The fastest way to launch this site is to use [Docker](https://www.docker.com/). You will also need to install [Docker compose](https://docs.docker.com/compose/install/).

1. `git clone` this repo
1. `docker-compose up`
1. Go to `http://localhost:4000` to test

The default Docker compose configuration supports hot-reloading of your local environment, meaning that as you edit files to change markup, text, images, etc, your local development server will pick up these changes and reload the latest version of the site for you. This makes it quick and convenient to develop on the site locally.

## Manual quick start

1. `git clone` this repo
1. Install [Jekyll](http://jekyllrb.com/docs/installation/)
1. Just the first time: `bundle install`
1. Start Jekyll server: `bundle exec jekyll serve --livereload`
1. Go to `http://localhost:4000`

## Deploying

To deploy the site:

1. Create a PR with your code changes
1. After the PR has been approved, merge it into `master`
1. The releaser bot will create a Draft release
1. Go to the [releases page](/releases) and update the draft release with the relevant information
1. Release it
1. The CI/CD pipeline will deploy it automatically

## Technologies

1. Built with [Jekyll](http://jekyllrb.com/). This website is completely static and we use basic HTML or Markdown for
   everything.
1. Preview environments are built with [Netlify](https://netlify.com).
1. Hosted on Amazon S3, with CloudFront as a CDN. Using [s3_website](https://github.com/laurilehmijoki/s3_website) to
   automatically upload static content to S3.
1. We use [Bootstrap](http://www.getbootstrap.com/) and [Less](http://lesscss.org/).
1. We're using [UptimeRobot](http://uptimerobot.com/), [Google Analytics](http://www.google.com/analytics/), and [HubSpot Traffic Analytics](https://knowledge.hubspot.com/reports/analyze-your-site-traffic-with-the-traffic-analytics-tool) for monitoring and metrics.

## Troubleshooting

### Disabling the Jekyll Feed gem

The Gruntwork website uses a Ruby Gem called `Jekyll Feed` which generates a structured RSS feed of "posts" on the site. Unfortunately, in development this can significantly slow down the hot-reloading of the site, forcing you to wait upwards of a minute at a time to see minor text changes locally.

You'll know this is happening when you look at the `STDOUT` of your `docker-compose` process and the final count of seconds spent `Generating feed for posts` is greater than 5:

```
web_1  |       Regenerating: 1 file(s) changed at 2021-07-21 14:31:08
web_1  |                     _data/website-terms.yml
web_1  |        Jekyll Feed: Generating feed for posts
web_1  |                     ...done in 58.507850014 seconds.
```

As a temporary workaround, you can open the Gemfile in the root of the project directory and temporarily comment out the line that pulls in the Jekyll Feed dependency:

```
source 'https://rubygems.org'
gem 'jekyll', '~> 4.1'
gem 's3_website', '3.3.0'
group :jekyll_plugins do
  gem 'jekyll-redirect-from', '0.16.0'
  gem 'jekyll-sitemap', '1.4.0'
  gem 'jekyll-paginate', '1.1.0'
  gem 'therubyracer', '0.12.3'
  gem 'less', '2.6.0'
  gem 'jekyll-asciidoc'
  gem 'jekyll-toc'
  gem 'nokogiri', '1.11.0.rc4' # Addressing security issue in earlier versions of this library
#  gem 'jekyll-feed'
end
```

*Important* - Be sure that you don't end up committing this change because we do want the Jekyll Feed plugin to run for production!

### I made changes locally but they're not being reflected in my hot-reloaded development environment

This can happen especially if you add or remove files from the website's working directory. When this occurs, terminate your `docker-compose` process and restart it to see your changes reflected.

## License

See [LICENSE.txt](LICENSE.txt). test
