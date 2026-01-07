---
title: "Demystifying Debouncing"
publishedAt: "2022-10-16"
summary: "What is Debouncing, how to implement it and when to use it?"
tags: ["javascript", "react", "api"]
image: "https://i.ibb.co/8DkCB9d4/debounce.jpg"
---

**Debouncing** is a term that is often used by developers to describe a programming practice, so what is it?
It is a technique used to ensure that time and resource consuming tasks are not fired that often , in other words prevent a function from being called multiple times in rapid succession.

So before jumping to how to implement it, let's check a real world scenario where we can use it. Last week I was asked to develop a search bar where the user can enter a search text and this will trigger an api call to search for relevant products. Before going further ckeck the example below (React JS), it is just a mock of the task I was asked to develop.

![Class component with no debounce.](/images/blogs/debounce/class-no-debounce.png "Class component with no debounce.")

![Functional component with no debounce.](/images/blogs/debounce/function-no-debounce.png "Functional component with no debounce.")

Let's consider that the console.log is the call to the api. What is the problem here? everything looks fine, right! Well not exactly because on every key stroke we will hit the api, so if the called endpoint takes time then the web page performance will decrease and may even become unresponsive and freezes (check the result below).

![Result of the before code.](/images/blogs/debounce/console-no-debounce.png "Result of the before code.")

So how to solve this? Short answer => **Debouncing** 😎.  
Like we said at the beginning of the article, we will try to not call the api that often, it means not on every key stroke but we will use a delay. Before going to the debounce function implementation let's check how the components became:

![Class component with no debounce.](/images/blogs/debounce/class-with-debounce.png "Class component with no debounce.")

In the class component we only had to pass the function we want to delay its execution and the delay (time) wanted to the debounce function and boom! the resulted function is the one we use from now on to make the api call.

![Functional component with debounce.](/images/blogs/debounce/function-with-debounce.png "Functional component with debounce.")

For functional components, it just needs a little bit of adjustment, why? because in react functional components are re-created on every render and therefore our private variables (which are used to delay) are reset everytime the component re-renders.  
The solution here is to use the useCallback hook which will help us preserve the same function reference between re-renders.
Thus will get the result shown below:

![Result of the after code.](/images/blogs/debounce/console-with-debounce.png "Result of the after code.")

Magic right! now let's go to the actual implementation of the debounce function

![Debounce function.](/images/blogs/debounce/debounce.png "Debounce function.")

What! that's it?? Yes this small piece of code is what it takes to make the UX much better.
Let's start by tearing it down piece by piece. The debounce function accepts 2 params the function that we want to delay its execution when called and the delay. **debounce** returns a function which when called will run at first time setTimeout which will call the **fn** param after **delay** if **debounce** is called again then the **timeout** variable will have an id and it will be cleared and a new delay timer is started.

Also what we could have done is to debounce the value itself of the search box and make a custom hook for that for the functional component, I will leave this as an exercise for you.

That’s it guys! I hope you found this article useful and if it was helpful please share it!
