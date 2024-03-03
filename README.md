# Worth the Click

A Chrome extension which uses the Power of [OpenAI](https://openai.com/) and [Langchain](https://js.langchain.com/docs/get_started/introduction) to summarize an external link when hovering over it.

![Worth the Click](./images/worth-the-click.gif)

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

It runs [Bun's watch](https://bun.sh/guides/read-file/watch) and a local [server](#server).

### Server

The server uses [Miniflare](https://github.com/cloudflare/workers-sdk/tree/main/packages/miniflare) alongside with [Hono and Cloudflare Worker](https://hono.dev/getting-started/cloudflare-workers).

Start the server

```bash
bun server
```

### Load an unpacked extension

The output file will be put inside `dist` as `index.js`. Use that to install it.

In development, you need to add this extension.
Please, check out [this tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Todos

I wrote a (hopefully) comprehensive series about this repository.

- [x] [Structure and manifest.json](https://dev.to/jolodev/developing-your-own-chrome-extension-the-theory-part-1-2d93)
- [x] [Add development environment with Bun and Typescript](https://dev.to/jolodev/developing-your-own-chrome-extension-in-bun-and-typescript-part-2-50h7)
- [x] [Add Streaming and Summarizer with LangChain and OpenAI](https://dev.to/jolodev/developing-your-own-chrome-extension-with-openai-and-langchain-part-3-4nbl)
- [x] [Hoisting Code before Initialization with ts-morph](https://dev.to/jolodev/developing-your-own-chrome-extension-fixing-errors-with-ts-morph-and-using-buns-api-part-4-3hni)
- [x] [Add a Proxy Server with Miniflare and Cloudflare Workers](https://dev.to/jolodev/developing-your-own-chrome-extension-fetch-with-a-proxy-and-cloudflare-workers-part-5-95j)
- [ ] Add authentication (with [Lucia](https://lucia-auth.com/)?)
- [ ] Add more Styling
- [ ] Publish to Google Web store with GitHub actions
