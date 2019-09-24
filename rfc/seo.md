# Gruntwork.io SEO RFC

I read a lot of material in SEO, including going through a [guide to SEO](https://moz.com/beginners-guide-to-seo/).

## Important take aways

- We currently have some broken stuff in our website that should take priority over trying to improve SEO by creating more content. Ranked by (my perceived) importance:
  - Searching for site:gruntwork.io/guides will show us that our content is duplicated between the www and non www versions of the website. This is diluting our ranking. We need to add a canonical link to our headers
  - Our posts don't have meta descriptions
  - Our internal links usually have the same anchor text (the title of the guide), but Google interprets that as not being natural and will penalize us for that
  - We don't have a [sitemap](https://support.google.com/webmasters/answer/183668?hl=en)
- Many websites use rel=nofollow (blocks crawling and backlink ranking bonus) on all external content or on all of their comment section. This is so because linking to bad quality content penalizes their own ranking. We need to verify if it's the case before engaging in any comment marketing for SEO reasons since this nullifies SEO advantages (but might still be useful for driving users that will click on it). Backlinks are also more important from topically similar websites. Link in hashicorp >>>> link in reddit.
- All links on a page have a [link equity](https://moz.com/learn/seo/what-is-link-equity) and our own internal links are competing for this equity. We need to add nofollow to any link that we think should not earn a share. Attention: we can be penalized for linking to bad quality content but also for linking too much to some content! We should dive deeper into this and see if this means we should add nofollow to most of our AWS docs links.
- We could be more intentional about our robots.txt. Not crawling irrelevant pages or low performing pages raises the average performance of the website, which raises the ranking of the website.
- Landing pages might not be a good idea after all. Thin content used to be good SEO practice (have multiple pages for each thing), but this does not have lots of advantages to users so now Google penalizes this. As a rule of thumb, what's good for users will be good for rankings since Google uses machine learning on user behavior. So we should watch things like time on page, bounce rate etc. identify low performing pages vs high performing pages and perhaps remove or improve low performing pages.

![https://moz.imgix.net/learn/guides/Moz-BGSEO-Ch4-01-outlines-01.svg?auto=format&ch=Width&fit=max&q=50&s=e236ac8928a1cd1940243f15ce7dbb6d](https://moz.imgix.net/learn/guides/Moz-BGSEO-Ch4-01-outlines-01.svg?auto=format&ch=Width&fit=max&q=50&s=e236ac8928a1cd1940243f15ce7dbb6d)

- According to the poing above, user engagement becomes one of the most important things on a website. Which means adding the comment section is a good idea.

- Keywords are important but sometimes the most authoritative keywords are not the best ones. High-volume keywords are also more competitive to rank higher (keyword difficulty). Carefully [exploring the long tail](https://moz.com/blog/long-tail-seo-target-low-volume-keywords-whiteboard-friday) of relevant keywords to us might offer us a better advantage in ranking and in financial conversions.

  > For example, a person searching for "shoes" is probably just browsing. On the other hand, someone searching for "best price red womens size 7 running shoe" practically has their wallet out!

- Perhaps we were not intentional enough concerning keywords in our current content. According to the point above, phrases formulated as questions are SEO gold. We could do a search on the most common questions on our space and make sure these questions are phrased in our content

- Writing content is HARD so we need to make sure we are making the most for our buck. We need a strategy before deciding which content to write about. I've seen these two content strategies which seem very interesting

  - 10x content (😂 geez I *hate* the name)
    - Search the keyword(s) you want your page to rank for
    - Identify which pages are ranking highly for those keywords
    - Determine what qualities those pages possess
    - Create content that’s better than that
  - Top content refurbishment
    - See which of your content performs better
    - Take that content and [refurbish it for other platforms](https://moz.com/blog/refurbishing-top-content-whiteboard-friday) (Slideshare, YouTube, Instagram, Quora, etc.) to expand acquisition funnel beyond Google.

- Page speed is a very important SEO metric so we need to be extremely careful when making the website dynamic. Perhaps it's best to never migrate the guides to be dynamic? But images are the usually the top 1 culprit in page speed. We should consider optmizing the images for mobile and compressing all the images we use.

- There seems to be no correlation with text length and rankings (I looked this up to see if it is a problem that our guides are very long and if maybe we should break them up, but apparently it doesn't matter)

- Breadcrumbs are SEO-useful if they contain [micro data](http://schema.org/breadcrumb)

- Google ranks accessibility and mobile-friendliness

- Trustworthiness goes a long way both for search **and for users**. I think we need to make more prominent on our website that we maintain terratest, terragrunt & that jim wrote terraform up and running.



## Relevant Tools

- [Google's PageSpeed Insights tool](https://developers.google.com/speed/pagespeed/insights/) & [best practices documentation](https://developers.google.com/speed/docs/insights/rules)
- [Google's Mobile Website Speed & Performance Tester](https://testmysite.withgoogle.com/intl/en-gb)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)  Google’s automated tool for measuring a website’s performance, accessibility, progressive web apps, and more
- [Google Search Console](https://search.google.com/search-console/welcome) (Requires domain ownership verification)
-  [Optimizilla](https://imagecompressor.com/)or [ImageOptim](https://imageoptim.com/mac) Image compression
- [Link Explorer](https://moz.com/link-explorer) Free for up until a number of queries, checks link health



## Conclusion

I actually don't think that making tags clickeable and adding more landing pages is a priority at this point. According to my research, the landing pages could even be harmful if not done correctly. My suggested approach is:



1. Fix what's broken first, listed on first bullet point of take aways.
2. Investigate if and how often we should use rel=nofollow and the advantages of optmizing breadcrumbs on guides
3. Take the website on a tour through some of the Relevant Tools above
4. List issues that arise from item 3. and prioritize them along with results of 2.
5. Create RFC on keyword research
6. Create any more content
