---
title: "Accessibility and text contrast ratio"
publishedAt: "2021-12-06"
summary: "How text colors can downgrade your site accessibility rating and how you can fix that?"
tags: ["html", "css", "accessibilty"]
image: "https://i.ibb.co/yrN8vdK/accessibility.png"
---

Contrast ratio is the ratio between the maximum and minimum brightness. A text with a low contrast ratio is hard to read especially for people with low vision, for example we always use our phone outside in the sun and we always adjust the brightness so the text have sufficient contrast so we are able to read it.

### Lighthouse

To test accessibility within a page use Lighthouse in chrome DevTools, it will help you measure a lot of criteria and will point out the problems that the page has including any text whose contrast ratio dosen't meet the requirements.

![Lighthouse accessibility measuremnts.](/images/blogs/contrast-ratio/measure-failure.png "Lighthouse accessibility measuremnts.")

![Accessibility text contrast ratio problem.](/images/blogs/contrast-ratio/problem.png "Accessibility text contrast ratio problem.")

## Contrast ratio requirements

Before diging into how to fix the issue, we must know that lighthouse uses [success criterion 1.4.3 from WCAG 2.1](https://www.w3.org/TR/WCAG21/#contrast-minimum):

-Text that is 18 pt, or 14 pt and bold, needs a contrast ratio of 3:1

-All other text needs a contrast ratio of 4.5:1

> 1pt=1.333px therefore 14pt and 18pt are equivalent to approximately 18.5px and 24px.

## Problem fix

To fix the text contrast ratio problem just follow the steps below:

- Inspect the text element you want to fix, once the console is open just go to the Styles tab of the Elements pane and it will show you all of the styles applied to the inspected element. in the elements styles look for the 'color' value of the element.

![inspected element.](/images/blogs/contrast-ratio/stylepane.png "inspected element color property.")

- Next to the color value will be a box that shows the text color, clicking it will open a dialog which is a color picker which displays also the contrast ratio and if it the contrast ratio is not ok, it will show a red icon.

![text contrast ratio failure.](/images/blogs/contrast-ratio/contrast-failure.png "text contrast ratio failure.")

- In case of failure (red icon), there will be suggested colors in the contrast ratio section (it can be expanded) which are the color boxes next to contrast ratio levels (AA and AAA).

![Choosing the color of AA level.](/images/blogs/contrast-ratio/aa-level.png "Choosing the color of AA level.")

![Choosing the color of AAA level.](/images/blogs/contrast-ratio/aaa-level.png "Choosing the color of AAA level.")

- If the proposed color dosen't suit your needs then you can use HSLA color format and adjust the lightness according to your prefrences but also make sure that it meets the contrast level requirements for your text, contrast ratio will be updated while changing the color.

![HSLA color format.](/images/blogs/contrast-ratio/hsla.png "HSLA color format.")

- Another method is that you can choose the color from within the color gradient picker at the top of the dialog. But how? you will see 2 white lines which will show you the contrast threshold, for the bottom line any color from under will pass the AAA contrast requirements, any color in between the lines will pass the AA contrast requirements and any color above the top line will fail.

![color gradient.](/images/blogs/contrast-ratio/color-gradient.png "color gradient.")

- If you do not see the contrast ratio that means no background color is set on the element or the parent element, also sometimes with background color defined, no information displayed about the contrast ratio. So what to do in that case?

![no contrast ratio info.](/images/blogs/contrast-ratio/no-info.png "no contrast ratio info.")

- If none of the above methods worked for you or simply you didn't like all of them and want something simpler, just go to this [website](https://contrastchecker.com/) and put the text color value in the foreground input and the backgroung color in the background input and click outside and it will show you if it passes or not and you can adjust the color by using the color picker and checking the boxes in the bottom (box will turn green if color chosen meet the requirements).

![color picker.](/images/blogs/contrast-ratio/site-picker.png "color picker.")

![site color picker success.](/images/blogs/contrast-ratio/site-success.png "site color picker success.")

That’s it guys! I hope you found this article useful and if it was helpful please share it!
