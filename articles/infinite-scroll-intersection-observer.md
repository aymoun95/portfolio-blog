---
title: "Infinite Scroll (React Query) And Intersection Observer"
publishedAt: "2025-07-15"
summary: "Learn how to implement infinite scrolling in React using the Intersection Observer API and React Query's useInfiniteQuery hook."
tags: ["react", "typescript", "intersection-observer", "react-query"]
image: "https://i.ibb.co/HTCxrtZj/intersection.jpg"
---

Infinite scroll is a popular UX pattern for loading data as the user scrolls, rather than all at once. In React, you can implement this efficiently using the **Intersection Observer API** and **React Query**. Let’s break down how this works, using the code from this project as a guide.

---

## 1. The Intersection Observer Hook

The **Intersection Observer API** lets you detect when an element enters or leaves the viewport. In React, you can wrap this logic in a custom hook.

![Intersection Observer Hook](/images/blogs/infinite-scroll/intersection-observer-hook.png "Intersection Observer Hook")

- `rootRef` is the scrollable container.
- `ref` is the sentinel element at the end of your list.
- When the sentinel is fully visible (`threshold: 1.0`), the callback fires — perfect for triggering a data fetch.

---

## 2. Fetching Data with React Query

React Query’s `useInfiniteQuery` makes paginated data fetching simple.

![useUsers Hook.](/images/blogs/infinite-scroll/inifinte-query-hook.png "useUsers Hook")

- `useInfiniteQuery` manages pages of users.
- `getNextPageParam` controls when to stop fetching (after 5 pages here).

The `fetchUsers` function makes a call to a public api to get a list of random users.

![fetchUsers.](/images/blogs/infinite-scroll/network-call.png "fetchUsers")

---

## 3. Putting It Together in the App

In `App.tsx`, you call the intersection observer and the query hooks:

![App Component Logic.](/images/blogs/infinite-scroll/refetching-logic.png "App Component Logic")

- The sentinel `<li>` at the end of the list uses `sentinelRef`.
- When it enters view, the next page is fetched if available.

The relevant JSX:

![App Component Return](/images/blogs/infinite-scroll/render-logic.png "App Component Return")

## 4. Why This Pattern?

- **Performance:** Only loads what’s needed.
- **User Experience:** Seamless, no manual “Load More” button.
- **Separation of Concerns:** The Intersection Observer hook is reusable for any infinite scroll scenario.

## 5. Final Result

![Infinite Scroll Demo](/images/blogs/infinite-scroll/demo.gif)

---

## Conclusion

By combining the **Intersection Observer API** with **React Query’s infinite queries**, you get a robust, efficient infinite scroll solution in React. The hooks are reusable, and the logic is cleanly separated, making your codebase easier to maintain and extend.

**GitHub Repository:** [https://github.com/aymoun95/infinite-scroll](https://github.com/aymoun95/infinite-scroll)
