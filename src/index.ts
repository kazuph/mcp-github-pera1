#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { GithubUrlSchema, buildWorkerUrl } from './githubTool.js';

// Schema definitions reused from githubTool.ts
const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

// Server setup
const server = new Server(
  {
    name: 'mcp-github-pera1',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: 'github_get_code',
      description: `
Retrieves code from a GitHub repository URL and combines it into a single file. The URL must start with "https://".

Query Parameters:
- dir: Filter files by directory paths (comma-separated)
  Example: ?dir=src/components,tests/unit
- ext: Filter files by extensions (comma-separated)
  Example: ?ext=ts,tsx,js
- mode: Display mode
  Example: ?mode=tree (Shows directory structure and README files only)
- branch: Specify the branch to fetch from (optional)
  Example: ?branch=feature/new-feature
- file: Specify a single file to retrieve (optional)
  Example: ?file=src/components/Button.tsx

Examples:
1. For GitHub tree URLs with branch:
  https://github.com/kazuph/pera1/tree/feature/great-branch
  This URL will be automatically parsed to extract the branch information.

2. For specific directory in a branch:
  url: https://github.com/modelcontextprotocol/servers
  dir: src/fetch
  branch: develop

3. For a single file:
  url: https://github.com/username/repository
  file: src/components/Button.tsx

4. For directory structure with README files only:
  url: https://github.com/username/repository
  mode: tree

The tool will correctly parse the repository structure and fetch the files from the specified branch.
`,
      inputSchema: zodToJsonSchema(GithubUrlSchema) as ToolInput,
    },
  ];

  return { tools };
});

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    try {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'github_get_code': {
          const parsed = GithubUrlSchema.safeParse(args);
          if (!parsed.success) {
            throw new Error(
              `Invalid arguments for github_get_code: ${parsed.error}`
            );
          }

          try {
            const response = await fetch(buildWorkerUrl(parsed.data));

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();

            return {
              content: [
                {
                  type: 'text',
                  text,
                },
              ],
            };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            return {
              content: [
                {
                  type: 'text',
                  text: `API Error: ${errorMessage}`,
                },
              ],
              isError: true,
            };
          }
        }
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  }
);

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP GitHub Pera1 Server running on stdio');
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
