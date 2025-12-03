# HTI Manus Skills

Pre-configured Manus AI task prompts for HubZone Technology Initiative automation.

## Available Skills

| Skill | Description | Use Case |
|-------|-------------|----------|
| [Lead Researcher](./hti-lead-researcher.md) | Find potential donors and corporate sponsors | Donor prospecting |
| [Grant Scanner](./hti-grant-scanner.md) | Search for matching grant opportunities | Grant pipeline |
| [Equipment Pricer](./hti-equipment-pricer.md) | Market analysis for device pricing | Inventory pricing |

## Quick Start

### Using Manus CLI

```bash
# Set your API key
export MANUS_API_KEY="your_key_here"

# Run a skill
manus run --prompt "$(cat hti-lead-researcher.md)"
```

### Using Manus API

```python
from manus_skills import run_hti_skill

# Run lead research
result = run_hti_skill("lead-researcher")

# Run grant scanning
result = run_hti_skill("grant-scanner")

# Run equipment pricing
result = run_hti_skill("equipment-pricer")
```

### Using Manus MCP

The skills can be triggered via Claude Code using the Manus MCP tools:

```
# In Claude Code, use:
mcp__manus-mcp__google_search with relevant queries
mcp__manus-mcp__browse_web for deep research
mcp__manus-mcp__code_interpreter for data analysis
```

## Skill Outputs

Each skill generates:
1. **CSV data file** - Structured data for import into HTI Hub
2. **Markdown report** - Human-readable analysis and recommendations
3. **Action items** - Prioritized next steps

## Scheduling (via Manus Scheduled Tasks)

Recommended cadence:
- **Lead Researcher**: Monthly
- **Grant Scanner**: Weekly (deadlines change frequently)
- **Equipment Pricer**: Quarterly (market rates are stable)

## Integration with HTI Hub

Results from these skills can be:
1. Imported into the Inventory page (pricing data)
2. Added to Priority Alerts (grant deadlines)
3. Synced to the CRM page (donor prospects)

## Customization

Edit the markdown files to:
- Adjust search criteria
- Change output formats
- Add new data sources
- Modify scoring weights
