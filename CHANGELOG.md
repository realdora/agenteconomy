# Changelog

## 2026-06-15

### Added

- **Agent-native access layer.** The dataset is now consumable by AI agents directly, no key or signup:
  - MCP server at `/api/mcp` (streamable HTTP, read-only, stateless) with tools `list_protocols`, `get_protocol`, `get_off_chain`, and `get_data_freshness`, each returning self-described JSON.
  - OpenAPI 3.1 contract at `/openapi.json` covering both feeds (fields, units, examples).
  - Agent index at `/llms.txt`; `Dataset` and `WebAPI` JSON-LD in every page head.
- Homepage section "Point your agent at it" documenting the agent-native surfaces with the live MCP endpoint and example tool responses.

### Changed

- Landing refresh: rebuilt the standards / partners / data-source logo wall as mark-and-name lockups, redesigned the hero "Made to track" panel into a live on-chain event stream, tightened section spacing, and unified the dashboard call to action.
- Copy: on-chain totals are labeled as cumulative ("events tracked") rather than a daily rate.

### Fixed

- Reduced-motion hydration mismatch on the hero price panel.
- Chart guards for degenerate data series, so a thin upstream snapshot no longer blanks a chart.
- Mobile: the hero heading is no longer clipped under the sticky header, and the `data.json` terminal scrolls horizontally on phones.
