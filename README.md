# GitHub MCP Server for Pera1

[![smithery badge](https://smithery.ai/badge/@kazuph/mcp-github-pera1)](https://smithery.ai/server/@kazuph/mcp-github-pera1)

A Model Context Protocol server that connects GitHub code to Claude.ai. This server utilizes the Pera1 service to extract code from GitHub repositories and provide better context to Claude.

<a href="https://glama.ai/mcp/servers/m2sd6ew3wf"><img width="380" height="200" src="https://glama.ai/mcp/servers/m2sd6ew3wf/badge" alt="@kazuph/mcp-github-pera1 MCP server" /></a>


### Installing via Smithery

To install GitHub MCP Server for Pera1 for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@kazuph/mcp-github-pera1):

```bash
npx -y @smithery/cli install @kazuph/mcp-github-pera1 --client claude
```

### Setup

Add the following to your MCP config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-github-pera1"]
    }
  }
}
```

Now you can ask Claude about GitHub code repositories.

### Parameters

- `url`: GitHub repository URL (required)

### Usage Example

You can ask Claude questions like:
```
Tell me about the implementation of GitHub repository https://github.com/username/repository
```

### License

MIT

### Author

kazuph (https://x.com/kazuph)
