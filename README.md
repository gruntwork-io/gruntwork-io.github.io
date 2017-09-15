# gruntwork.io website

This is the code for the [Gruntwork website](http://www.gruntwork.io).

Gruntwork gets you up and running on AWS with DevOps best practices and world-class infrastructure in about 2 weeks.
You focus on your product. We'll take care of the Gruntwork.

## Quick start

1. Use Git to clone this repo
2. Make sure you have [Jekyll](http://jekyllrb.com/docs/installation/) installed
3. Just the first time: `bundle install`
5. Start Jekyll server: `bundle exec jekyll serve`
6. Compile Less by running `lessc --clean-css app.less app.css` in `/assets/css`
7. Go to `http://localhost:4000`

See the [Jekyll](http://jekyllrb.com/) and [GitHub Pages](https://pages.github.com/) documentation for more info.

## Docker quick start

As an alternative to installing Ruby and Jekyll, if you're a user of [Docker](https://www.docker.com/) and [Docker
Compose](https://docs.docker.com/compose/), you can run a Docker image of gruntwork-io that has all the dependencies
already setup for you.

On Linux:

1. `git clone` this repo
2. `docker-compose up`
3. Go to `http://localhost:4000` to test

On OS X, using the [docker-osx-dev](https://github.com/brikis98/docker-osx-dev) project:

1. `git clone` this repo
2. In one tab: `docker-osx-dev`
3. In another tab: `docker-compose up`
4. Go to `http://default:4000` to test

*NOTE: If using the old [boot2docker](http://boot2docker.io/) to run Docker on OS X, instead of `http://default:4000`, the URL will be `http://dockerhost:4000`. If using [docker-machine](https://docs.docker.com/machine/) to run Docker on OS X, replace `default` with the name of your docker-machine (which by default is `default`.)*

*Finally, if using the new [Docker for Mac](https://blog.docker.com/2016/03/docker-for-mac-windows-beta/), then `docker-osx-dev` will hopefully no longer be necessary.*

## Technologies

1. Built with [Jekyll](http://jekyllrb.com/). This website is completely static and we use basic HTML or Markdown for
     everything.
2. Hosted on [GitHub Pages](https://pages.github.com/). We're using the [GitHub Pages
   Gem](https://help.github.com/articles/using-jekyll-with-pages/) and only Jekyll plugins that are [available on
   GitHub Pages](https://help.github.com/articles/repository-metadata-on-github-pages/).
3. We use [BootstrapCSS](http://www.getbootstrap.com/), [Less](http://lesscss.org/).
4. The logo is built from two images on The Noun Project: [Monster](https://thenounproject.com/term/monster/184225/)
   and [Hard Hat](https://thenounproject.com/term/hard-hat/410909/).
5. We're using [UptimeRobot](http://uptimerobot.com/) and [Google Analytics](http://www.google.com/analytics/) for
   monitoring and metrics.

## License

This code is released under the MIT License. See LICENSE.txt.
