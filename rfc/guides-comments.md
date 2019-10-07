
  

## RFC for Adding Comments to our Deployment Guides

  

 Options available for adding comments to the deployment guides are as follows:
### Disqus: <https://disqus.com/>
 
Really good third party service and the most popular. It has 3 options:
- Basic: This has ad's (not recommendxed)
- Plus $9 per month (Suitable for under 50k visitors daily)
- Pro $89 per month (Suitable for 150k visitors daily)

#### Pros:
1. It provides a dashboard to manage for all the comments posted.
2. Analytics available for comments on the dashboard.
3. We can control the look and feel of the design
4. Very easy to install
5. Google indexes disqus comments based on relevance. Google focuses on the quality of the comment if it is good enough for the audience. [ref1](https://code-interactive.com/ad-in/2018/10/does-google-index-disqus-comments/) [ref2](https://www.quora.com/Is-Disqus-actually-SEO-friendly) [ref3](https://www.quora.com/Does-Disqus-help-SEO-for-a-website)

#### Cons
1. Being a third party service, we don't know what our comments become and how disqus uses the data retrieved from the comments
2. Disqus doesn't have a great track record on privacy
3. Does not allow anonymous content
4. It adds a lot of page weight. About 450kB of data

> Indexing is not as good as if rendered from the server-side

### Just comments [https://just-comments.com/](https://just-comments.com/pricing.html)
Also a third party service and very similar to Disqus
#### Pros:
1. Look and feel of the design is customizable
2. Pay as you go but you will need to pay 5.30 dollars for having an active api key per month
3. Page weight is about 25kb
4. They do not track users
5. Comments are indexed by google
6. We can get notified when there are new comments

#### Cons
1. We have no control over the data
2. They have been in business for less than a year

### Commento <https://commento.io/>
#### Pros
1. The data retrieved is ours
2. Pay what we want <https://commento.io/pricing>

#### Con
1. We have to host the solution

> N/B: They also have a hosted solution which we need to pay for but not sure if the amount to be paid is different from the amount on the pricing page. I have sent an email to get more info regarding this. Still waiting for a reply

 ### Staticman: <https://staticman.net/>
#### Pros:
1. It is a free
2. Designed to work with jekyll
3. Complete control over the data/content, user experience, and user interface.
4. Not just for comments! Perfect for any sort of user generated content: reviews, comments, polls, and more.
5. Allows comments to be posted without any login required.
6. Has integration to Akismet and reCaptcha.
7. Renders everything server-side, which is better for SEO. Also, minimal page weight

#### Cons:
1. Staticman must access to our Jekyll repository
2. Spamming- There is no form of authentication.
   
> N/B We have to be careful of XSS attacks..

### Gitment [https://github.com/imsun/gitment](https://github.com/imsun/gitment)
A comment system based on GitHub Issues
#### Pros:
1. Very easy to include on our page
2. We own the content
#### Cons
1. You can only login with a github account before you can leave comments
2. Not sure if this is an issue but seems it is not actively maintained. The last update to this was 3 years ago
> N/B It was specified that it is light weight but could not find any content regarding it’s page weight. I am also not certain if comments can be indexed by google

### Utterances Ref https://utteranc.es/
This is also a really nice commenting system and a lightweight comments widget built on GitHub issues.
#### Pros
1. It is Open source
2. it is free
3. There is zero user tracking
4. All comments are written in Markdown, allowing inline code, images, lists and formatting.
5. We can also integrate Github Reactions
6. The data retrieved are stored in GitHub issues
7. If we have got enough feedback on a post, we can disable comments
8. I’m guessing it will also be indexed by google. Not certain

#### Cons

1. Readers must have a GitHub account to comment.
2. Utterances uses third-party cookies. If you run a privacy-focused browser or browser extensions, this can require whitelisting Utteranc.es servers to see the comments.
Ref: https://robb.sh/posts/comments-utterances/
> N/B we can create a separate public repo to hold comments

### Conclusion:

I think we can either use Utterances or Staticman. If we are more focused on a broader audience commenting on the posts not restricted to only github users, then staticman will be our best pick.