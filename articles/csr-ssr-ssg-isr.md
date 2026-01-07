---
title: "CSR vs. SSR vs. SSG vs. ISR"
publishedAt: "2021-12-06"
summary: "Different rendering approaches and their use cases?"
tags: ["nextjs", "csr", "ssr", "ssg", "isr"]
image: "https://i.ibb.co/hRv4pk6q/rendering-modes.png"
---

As developers we face lots of challenges other than coding the product (mobile apps, landing pages, dashboards...) especially when it comes to the architecture we choose to reach the best performance. Well if you're reading this article that means you came across the terms (CSR-SSR-SSG-ISR) but you didn't understand them or when to use them. In this blog I'm going to explain every term and when to use it so in the future, you will be able to build a product with confidence that you have chosen the best approach. Before diving in, you have to know that they are different rendering modes for your website, knowing that, lets start explaining them one by one.

# CSR

Stands for client side rendering, this is the typical approach that frameworks like Angular, Vue or React ships as default and it became popular with the appearance of those frameworks. On client request, server sends a HTML file (a pretty empty document with links to your javascript) to the client without any data, then the browser downloads the sent file and start the parsing process then it loads javascript, once the framework (if you're using one) has taken over, it fetches data (useEffect in React e.g.) from external sources (server, 3rd party api). Upon data fetching, the layout is updated (useState in React e.g.).

## Pros

- Fast rendering

- Page gets displayed immediately

- Decreased load on the server

## Cons

- Not SEO freindly

- It needs multiple round trips to the server (no initial data)

# SSR

Stands for server side rendering. On every request and instead of shiping the raw markup, our server take the responsibility to fetch the data on the server and construct a ready to be rendered HTML, once completed, the server ships the page to the client, when downloaded the browser renders it immedialtely no need to wait for loading or executing javascript nor to fetch the data (as it is fetched on the server).

## Pros

- Good for SEO

- No blank loading state, it's pre(rendered)

## Cons

- Slower TTFB (time to first byte), due to prerendring, before moving to the request page (page loaded using SSR) using router it will stater a little.

- cannot be cached by CDN

# SSG

Stands for static site generation. In this approach, we fetch the data at build time so we would have a static site and we can serve it from a CDN and when the client request the site, we send him the prebuilt markup and the browser just renders it and no need for any additional work.

## Pros

- Good for SEO

- Fastest way

- Build once

- Can be served by CDN

- Gets cached for a long time

- Page gets displayed immediately

- No server needed

## Cons

- Changing data needs a rebuild

# ISR

Stands for incremental Static Regeneration. This approach we can look at it as a hybrid of SSR and SSG and provides the best of both worlds. We prebuild the site as we do in the SSG approach but we rebuild the page for at most every intervall(every 10 seconds rebuild the page e.g.), this is called revalidation limit time meaning regenerate at most one time when a new request comes after X time. But isn't this time and resource consuming as we have to rebuild the site every interval (at most)? Well, no, as this render method enables us to use static generation on per page basis without the needing to rebuild the entire site.

## Pros

- Good for SEO

- Builds faster

- Can be cached for interval time

- Get the performance of static page combined with the power of new dynamic data

## Cons

- Always builds even if external data is the same

- If data changes within the interval, client will get an old version of the page

- For the first user after the intervall passes the client will see a fallback first and once rebuilt his data will get revalidated

But what are their use cases?

- **CSR**: When SEO is not important and we are building a very dynamic page (a private dashbaord e.g.).

- **SSR**: Page that needs data at request time or page with heavy work load (A.I or network of communities: reddit e.g.).

- **SSG**: Static page when data changes once every now and then (blog or service page e.g.).

- **ISR**: More dynamic page than the static one but not always just every interval (product page = products changes once in a week e.g.).

If you still can't decide which one to choose as you have use cases for everyone of them in your site, best to use is Next.js which is a hybrid framework and provides all of the different rendering approaches out of the box so you can choose on a per page basis best way to render it.

That’s it guys! I hope you found this article useful and if it was helpful please share it!
