# gruntwork.io website

This is the code for the [Gruntwork website](https://www.gruntwork.io).

Gruntwork can help you get your entire infrastructure, defined as code, in about one day. You focus on your product.
We'll take care of the Gruntwork.



## Docker quick start

The fastest way to launch this site is to use [Docker](https://www.docker.com/).

1. `git clone` this repo
1. `docker-compose up`
1. Go to `http://localhost:4000` to test




## Manual quick start

1. `git clone` this repo
1. Install [Jekyll](http://jekyllrb.com/docs/installation/)
1. Just the first time: `bundle install`
1. Start Jekyll server: `bundle exec jekyll serve`
1. Go to `http://localhost:4000`




## Deploying

To deploy the site to S3/CloudFront:

1. Configure your AWS credentials as environment variables.
1. `docker-compose run web ./push-to-s3.sh`




## Technologies

1. Built with [Jekyll](http://jekyllrb.com/). This website is completely static and we use basic HTML or Markdown for
   everything.
1. Hosted on Amazon S3, with CloudFront as a CDN. Using [s3_website](https://github.com/laurilehmijoki/s3_website) to
   automatically upload static content to S3.
1. We use [Bootstrap](http://www.getbootstrap.com/) and [Less](http://lesscss.org/).
1. We're using [UptimeRobot](http://uptimerobot.com/) and [Google Analytics](http://www.google.com/analytics/) for
   monitoring and metrics.




## License

This code is released under the MIT License. See LICENSE.txt.
