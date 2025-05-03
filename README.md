[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/kazuph-mcp-github-pera1-badge.png)](https://mseep.ai/app/kazuph-mcp-github-pera1)

# GitHub MCP Server for Pera1

A Model Context Protocol server that connects GitHub code to Claude.ai. This server utilizes the Pera1 service to extract code from GitHub repositories and provide better context to Claude.

<a href="https://glama.ai/mcp/servers/m2sd6ew3wf"><img width="380" height="200" src="https://glama.ai/mcp/servers/m2sd6ew3wf/badge" alt="@kazuph/mcp-github-pera1 MCP server" /></a>

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
- `dir`: Filter files by directory paths (comma-separated)
- `ext`: Filter files by extensions (comma-separated)
- `mode`: Display mode (e.g., `tree` shows directory structure and README files only)
- `branch`: Specify the branch to fetch from
- `file`: Specify a single file to retrieve

### Usage Examples

You can ask Claude questions like:
```
Tell me about the implementation of GitHub repository https://github.com/username/repository
```

For specific directories:
```
Explain the components in https://github.com/username/repository?dir=src/components
```

For a specific file:
```
Show me the Button component from https://github.com/username/repository?file=src/components/Button.tsx
```

For directory structure with README files only:
```
Show me the structure of https://github.com/username/repository?mode=tree
```

For a specific branch:
```
Analyze the develop branch of https://github.com/username/repository?branch=develop
```

### License

MIT

### Author

kazuph (https://x.com/kazuph)
