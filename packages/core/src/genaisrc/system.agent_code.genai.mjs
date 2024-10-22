system({
    title: "Agent that can query code"
})

const model = env.vars.agentFsModel

defAgent("code", "Queries source code efficiently", 
    "You are an expert at retreiving information about source code, investigating stack trace and answering coding questions.",
    {
        model,
        tools: ["code_query"]
    }
)