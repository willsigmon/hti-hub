# HTI Lead Researcher

## Manus Task Prompt

Use this prompt to create a Manus task via API or CLI for finding potential donors/sponsors for HTI.

### Trigger Keywords
- "Find donors for HTI"
- "Research potential sponsors"
- "Identify corporate partners"

### Task Prompt

```
You are researching potential donors and sponsors for HubZone Technology Initiative (HTI), a 501(c)(3) nonprofit in Durham, NC that:
- Provides refurbished technology to underserved communities
- Runs digital literacy programs
- Operates in a HubZone (Historically Underutilized Business Zone)
- Has deployed 500+ devices to families and organizations
- Current budget deficit: $85,000 for 2026

RESEARCH TASK: Find 10-15 potential corporate sponsors or major donors that match HTI's profile.

SEARCH CRITERIA:
1. Companies with CSR (Corporate Social Responsibility) programs focused on:
   - Digital equity / digital inclusion
   - Education technology
   - Workforce development
   - Environmental sustainability (e-waste reduction)

2. Technology companies in the Triangle area (Raleigh-Durham-Chapel Hill)

3. Foundations that fund:
   - Digital literacy initiatives
   - Nonprofit technology organizations
   - North Carolina community development

4. Companies with HubZone certification incentives

FOR EACH PROSPECT, PROVIDE:
- Company/Foundation name
- Website URL
- CSR/Giving focus areas
- Estimated giving range (if available)
- Key contact or program name
- Fit Score (1-100%) with reasoning
- Recommended approach strategy

OUTPUT FORMAT:
Create a structured report with prospects ranked by Fit Score. Include:
1. Executive summary with top 5 recommendations
2. Detailed profiles for all prospects
3. Outreach priority matrix
4. Sample outreach email template for top prospect

Save results as: hti_prospect_research_{date}.csv and hti_prospect_report_{date}.md
```

### API Call Example

```python
import requests

response = requests.post(
    "https://api.manus.im/v1/tasks",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "prompt": "Find 10-15 potential corporate sponsors for HTI nonprofit...",
        "name": "HTI Lead Research"
    }
)
task_id = response.json()["task_id"]
```

### Expected Output
- CSV file with prospect data
- Markdown report with analysis
- Fit scores and prioritized recommendations
