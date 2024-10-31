
import { Code } from "@astrojs/starlight/components"
import source from "../../../../../packages/vscode/genaisrc/gcm.genai.mts?raw"

The `gcm` script provides a guided flow to create commit with generated messages.
It starts by generating a commit message based on the staged changes in your Git repository
using an [inline prompt](/genaiscripts/reference/scripts/inline-prompt)
and then asks the user to commit the changes or regenerate the message.

```text
compute diff
loop
   generate commit message
   ask user to commit, edit message or regenerate
   if user says commit
       git commit and push
```

## Configuration

First off, we define the `script` function, which sets up our GenAI script by providing a title and a description, and specifying the model we'll be using:

```ts
script({
    title: "git commit message",
    description: "Generate a commit message for all staged changes",
    model: "openai:gpt-4o",
})
```

## Look for changes

Next up, we check for any staged changes in your Git repository using `git diff`.
If there's nothing staged, GenAI kindly offers to stage all changes for you:

```ts
// Check for staged changes and stage all changes if none are staged
const diff = await git.diff({
    staged: true,
    askStageOnEmpty: true,
})
if (!diff) cancel("no staged changes")
```

We then log the diff to the console so you can review what changes are about to be committed:

```ts
console.log(diff.stdout)
```

## Generate and refine commit message

Here comes the interesting part. We enter a loop where GenAI will generate a commit message for you based on the diff. If you're not satisfied with the message, you can choose to edit it, accept it, or regenerate it:

```ts
let choice
let message
do {
    // generate a conventional commit message (https://www.conventionalcommits.org/en/v1.0.0/)
    const res = await runPrompt((_) => {
        _.def("GIT_DIFF", diff, { maxTokens: 20000, language: "diff" })
        _.$`Generate a git conventional commit message for the changes in GIT_DIFF.
        - do NOT add quotes
        - maximum 50 characters
        - use emojis`
    })
    // ... handle response and user choices
} while (choice !== "commit")
```

## Commit and push

If you choose to commit, GenAI runs the `git commit` command with your message, and if you're feeling super confident, it can even push the changes to your repository right after:

```ts
if (choice === "commit" && message) {
    console.log(
        (await host.exec("git", ["commit", "-m", message, "-n"])).stdout
    )
    if (await host.confirm("Push changes?", { default: true }))
        console.log((await host.exec("git push")).stdout)
}
```

## Running the Script with GenAIScript CLI

Use the [cli](/genaiscript/reference/cli) to run the script:

```shell
npx genaiscript run gcm
```

## Full source ([GitHub](https://github.com/microsoft/genaiscript/blob/main/packages/vscode/genaisrc/gcm.genai.mts))

<Code code={source} wrap={true} lang="ts" title="gcm.genai.mts" />
