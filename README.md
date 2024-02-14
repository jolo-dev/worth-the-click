# Worth the Click

A Chrome extension which uses the Power of [OpenAI](https://openai.com/) and [Langchain](https://js.langchain.com/docs/get_started/introduction) to summarize an external link when hovering over it.

## Idea

![Idea of the workflow](./images/Idea.png)

## Development

We use [Bun](https://bun.sh/), a fast all-in-one JavaScript runtime.
This project was created using `bun init` in bun v1.0.25.

```bash
bun install
```

To run:

```bash
bun dev
```

The output file will be put inside `dist` as `index.js`. Use that to install it.

### Load an unpacked extension

In development, you need to add this extension. Please, check out [this tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
