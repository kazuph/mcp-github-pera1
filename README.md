# YouTube MCP Server

Uses `yt-dlp` to download subtitles from YouTube and connects it to claude.ai via [Model Context Protocol](https://modelcontextprotocol.io/introduction). Try it by asking Claude, "Summarize the YouTube video <<URL>>". Requires `yt-dlp` to be installed locally e.g. via Homebrew.

### How do I get this working?

1. Install `yt-dlp` (Homebrew and WinGet both work great here)
   ```bash
   # macOS
   brew install yt-dlp

   # Windows
   winget install yt-dlp
   ```

2. Install this package via npm
   ```bash
   npm install -g @kazuph/mcp-youtube
   ```

3. Install and configure [mcp-installer](https://github.com/anaisbetts/mcp-installer)

### Parameters

- `url`: YouTube video URL (required)
- `language`: Subtitle language code (optional, default: 'ja')
  - Uses [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language codes
  - Common language codes:
    - `ja`: Japanese
    - `en`: English
    - `ko`: Korean
    - `zh`: Chinese
    - `fr`: French
  - Note: An error will occur if subtitles in the specified language do not exist

### Example

```typescript
// Get subtitles in default language (Japanese)
await getTranscript('https://www.youtube.com/watch?v=xxxxx');

// Get subtitles in English
await getTranscript('https://www.youtube.com/watch?v=xxxxx', { language: 'en' });
```
