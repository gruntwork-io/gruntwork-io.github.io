
## RFC for Adding Comments to our Deployment Guides

  

Options available for adding comments to the deployment guides are as follows:

  
1. #### Disqus: <https://disqus.com/>

Really good third party service and the most popular. It has 3 options:

- Basic: This has ad's (not recommended)

- Plus $9 per month (Suitable for under 50k visitors daily)

- Pro $89 per month (Suitable for 150k visitors daily)

  

Pros:

- It provides a dashboard to manage for all the comments posted.

- Analytics available for comments on the dashboard.

- We can control the look and feel of the design

- Very easy to install
- Google indexes disqus comments based on relevance. Google focuses on the quality of the comment if it is good enough for the audience.


Cons

- Being a third party service, we don't know what our comments become and how disqus uses the data retrieved from the comments

- Disqus doesn't have a great track record on privacy

- Does not allow anonymous content

- It adds a lot of page weight. About 450kB of data

  

1. #### Just comments [https://just-comments.com/](https://just-comments.com/pricing.html)

Also a third party service and very similar to Disqus

  
Pros:

- Look and feel of the design is customizable

- Pay as you go but you will need to pay 5.30 dollars for having an active api key per month

- Page weight is about 25kb

- They do not track users
- Comments are indexed by google
- We can get notified when there are new comments


Cons

- We have no control over the data

- They have been in business for less than a year

  


1. #### Commento <https://commento.io/>

Pros

- The data retrieved is ours
  
- Pay what we want <https://commento.io/pricing>

  

Con
- We have to host the solution

N/B: They also have a hosted solution which we need to pay for but not sure if the amount to be paid is different from the amount on the pricing page. I have sent an email to get more info regarding this. Still waiting for a reply

  

4. #### Staticman: <https://staticman.net/>

Pros:
- It is a free
- Designed to work with jekyll

- Complete control over the data/content, user experience, and user interface.

- Not just for comments! Perfect for any sort of user generated content: reviews, comments, polls, and more.

- Allows comments to be posted without any login required.
- Has integration to Akismet and reCaptcha. 

Cons:

- Not sure if it is a downside but Staticman access to your Jekyll repository


N/B  We have to be careful of XSS attacks..

  

1.  #### Gitment [https://github.com/imsun/gitment](https://github.com/imsun/gitment)

A comment system based on GitHub Issues

Pros:

- Very easy to include on our page

  
Cons

- You can only login with a github account before you can leave comments

- Not sure if this is an issue but seems it is not actively maintained. The last update to this was 3 years ago

N/B It was specified that it is light weight but could not find any content regarding it’s page weight. I am also not certain if comments can be indexed by google


1.  #### Utterances Ref https://utteranc.es/
This is also a really nice commenting system and a lightweight comments widget built on GitHub issues.

 ##### Pros
- It is Open source
- it is free 
- There is zero user tracking
- All comments are written in Markdown, allowing inline code, images, lists and formatting.
- We can also integrate Github Reactions 
- The data retrieved are stored in GitHub issues
- If we have got enough feedback on a post, we can disable comments
- I’m guessing it will also be indexed by google. Not certain

Cons
Readers must have a GitHub account to comment.
Utterances uses third-party cookies. If you run a privacy-focused browser or browser extensions, this can require whitelisting Utteranc.es servers to see the comments.
[*.]api.utteranc.es
https://[*.]utteranc.es:443 Ref: https://robb.sh/posts/comments-utterances/

N/B we can create a separate public repo to hold comments