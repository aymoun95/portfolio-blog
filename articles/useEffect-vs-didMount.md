---
title: useEffect mental model
publishedAt: "2021-12-06"
summary: how useEffect hook is different from componentDidMount and what should we do to surpass those differences
tags: ["javascript", "react", "hooks"]
image: "https://i.ibb.co/pBmxsxW5/effect.png"
---

Some think React **hooks** are a way to reproduce lifecycle methods in functional components, well, part of this is wrong. Some even say that `useEffect(()=>{},[])` is the new **componentDidMount** which is wrong.

Let me give you an example: lets say that you want to update the state synchronously in **componentDidMount** (like reading DOM dimensions...), in this case react knows how to trigger a second render without the user even notices that (no screen flickering).

But can we reproduce that in functional components? quick answer no, why is that? because the function passed to **useEffect** will run after the render is committed to the screen and with react "speed" the user will see a flicker.

let's state the steps of **componentDiDMount** and **useEffect**:

**componentDiDMount**:

1. You cause a first render
2. React calls render method
3. DidMount runs immediately after the DOM has been mounted and sets state immediately (synchrounous) but before the browser has had a chance to "paint" the DOM
4. render is called again with the new state
5. the browser now shows the second render which is the initial UI for the user (no flickering)

**useEffect**:

1. You cause a first render
2. React calls render method
3. The screen is visually updated (browser paints what the render method has returned)
4. useEffect runs and sets the state
5. render is called again
6. browser shows the second render which in this time is not the initial UI thus screen flickering

What is the solution? **useLayoutEffect**, updates scheduled inside **useLayoutEffect** will be flushed synchronously, before the browser has a chance to paint ([check docs](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)).

**useLayoutEffect**:

1. You cause a first render
2. React calls render method
3. useLayoutEffect runs, and React waits for it to finish
4. The browser paints the initial UI after useLayoutEffect finsihes

That means that we have to use **useLayoutEffect** instead of **useEffect**? not at all, despite that **useLayoutEffect** was designed to have same timing as **componentDidMount** but we should use it only to avoid the flicker by setting the state synchronously (animations...) as most of the time we use asynchrounous code in **componentDidMount** such as network calls and with that **useEffect** will be better solution then **useLayoutEffect**.

So we can think of hooks in terms of what we do instead of when to do.
If you want a more detailed explanation I recommand Dan's [article](https://overreacted.io/a-complete-guide-to-useeffect/).
