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

// Schema definitions
const GithubUrlSchema = z.object({
  url: z.string().url(),
});

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
      name: 'github_get_1file_code_by_pera1',
      description:
        'Retrieves code from a GitHub repository URL and combines it into a single file. The URL must start with "https://".',
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
        case 'github_get_1file_code_by_pera1': {
          const parsed = GithubUrlSchema.safeParse(args);
          if (!parsed.success) {
            throw new Error(
              `Invalid arguments for github_get_1file_code_by_pera1: ${parsed.error}`
            );
          }

          try {
            const response = await fetch(
              `https://pera1.kazu-homma.workers.dev/${parsed.data.url}`
            );

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
