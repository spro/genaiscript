
[Microsoft AICI](https://github.com/microsoft/aici/) allows to constrain the output of a LLM using WASM. In particular, it is possible to send JavaScript program to describe the prompt.

GenAIScript support executing scripts and converting the output into a AICI compatible JavaScript program, which will them generate constrainted output.

:::caution

This feature is experimental and may change in the future.

:::

Let's take a look at an example.

```js title="answer-to-everything.genai.mjs"
$`Ultimate answer is to the life, universe 
and everything is ${AICI.gen({ regex: /\d\d/ })}`
```

The execution of this script is converted into a AICI JavaScript program.

```js title="answer-to-everything.aici.js"
async function aiciregex() {
    await $`Ultimate answer is to the life, universe and everything is `
    await gen({ regex: /\d\d/ })
}

async function main() {
    await aiciregex()
}
start(main)
```

And AICI comes back with the following log.

```txt
FIXED "Ultimate answer is to the life, universe and everything is "
GEN-OPT {regex: /\d\d/}
regex constraint: "\\d\\d"
dfa: 160 bytes

GEN "42"
JsCtrl: done
```

And the text output is `42`.

## Metadata

An AICI template should set the `aici` provider in the model identifier.

```js title="answer-to-everything.genai.mjs"
script({ ...
    model: "aici:mixtral",
})
```

## `gen`

The `AICI.gen` function creates a constrain in the prompt flow.

## Token

AICI uses `AICI_API_KEY`, `AICI_API_BASE` and `AICI_API_VERSION` (default `v1`) to compose the API URL.

```
<base>/<model>/<version>/run
```
