system({
    title: "Source code query using Treesitter",
})

defTool(
    "code_query",
    "Uses tree-sitter to query code",
    {
        type: "object",
        properties: {
            filename: {
                type: "string",
                description:
                    "Path of the file to search, relative to the workspace.",
            },
            query: {
                type: "string",
                description: "code query using tree-sitter syntax",
            },
        },
        required: ["filename", "query"],
    },
    async (args) => {
        const { filename, query } = args
        const file = await workspace.readText(filename)
        if (!file.content) return "<file_not_found>"
        const res = await parsers.code(file, query)
        if (!res) return "<no_match_found>"
        return YAML.stringify(res)
    }
)
