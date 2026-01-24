export type McpServerId = keyof typeof MCP_SERVERS;

// { "mcp-id": { id: string, name: string, url: string } }
export const MCP_SERVERS = {
  "68f0a290f81ae7b79782adc9": {
    "id": "68f0a290f81ae7b79782adc9",
    "name": "Firecrawl",
    "url": "https://backend.composio.dev/v3/mcp/6f8c6c8b-f19d-4152-b3ac-3c62f7ff4540/mcp?user_id=692ba10086c50c404f9cea0c"
  },
  "686de4e26fd1cae1afbb55bc": {
    "id": "686de4e26fd1cae1afbb55bc",
    "name": "Github",
    "url": "https://backend.composio.dev/v3/mcp/4e4720cb-01e7-4e14-88f8-3567f0453182/mcp?user_id=692ba10086c50c404f9cea0c"
  },
  "686de4616fd1cae1afbb55b9": {
    "id": "686de4616fd1cae1afbb55b9",
    "name": "Notion",
    "url": "https://backend.composio.dev/v3/mcp/4c5f76f7-bbb8-4a8a-a478-ab5a2d7b0fa2/mcp?user_id=692ba10086c50c404f9cea0c"
  }
};