# HTI Grant Opportunity Scanner

## Manus Task Prompt

Use this prompt to find grant opportunities matching HTI's profile.

### Trigger Keywords
- "Find grants for HTI"
- "Search grant opportunities"
- "Grant deadline scanner"

### Task Prompt

```
You are a grant researcher for HubZone Technology Initiative (HTI), a 501(c)(3) nonprofit in Durham, NC.

ORGANIZATION PROFILE:
- Mission: Bridging the digital divide through refurbished technology and digital literacy
- Programs: Device refurbishment, community distribution, digital skills training
- Geography: Durham County, NC (HubZone designated)
- Track Record: 500+ devices deployed, 5+ years operating
- Budget: ~$200k annual, seeking to close $85k deficit
- EIN: [Available on request]
- Key Strength: Environmental sustainability + digital equity intersection

RESEARCH TASK: Find 15-20 grant opportunities that match HTI's profile.

SEARCH SOURCES:
1. Grants.gov - Federal opportunities
2. NC state grants portal
3. Foundation Directory Online patterns
4. Duke Endowment
5. Z. Smith Reynolds Foundation
6. Golden LEAF Foundation
7. Blue Cross Blue Shield NC Foundation
8. Google.org / Tech company foundations
9. Community foundation grants
10. Digital equity-specific funders (NDIA members, etc.)

FOR EACH GRANT, PROVIDE:
- Grant name and funder
- Application URL
- Deadline (exact date or rolling)
- Funding range
- Eligibility match (Yes/No/Partial with notes)
- Focus area alignment score (1-10)
- Competition level estimate (Low/Medium/High)
- Required materials checklist
- HTI-specific angle to emphasize

PRIORITIZATION CRITERIA:
1. Deadline within next 90 days (HIGH priority)
2. Funding amount $10k+
3. Strong mission alignment (digital equity, sustainability, workforce)
4. NC-based or accepts NC applicants

OUTPUT FORMAT:
1. Priority Matrix: Urgent (30 days) / Soon (60 days) / Planning (90+ days)
2. Detailed grant profiles
3. Calendar of deadlines
4. Gap analysis: What's missing from HTI's grant readiness?

Save results as: hti_grants_{date}.csv and hti_grant_calendar_{date}.md
```

### Calendar Integration

After running this task, you can:
1. Export deadlines to Google Calendar via Manus MCP connector
2. Set up scheduled re-runs (weekly) to catch new opportunities
3. Create Slack/email alerts for approaching deadlines

### Sample Findings Structure

| Grant | Funder | Deadline | Amount | Match |
|-------|--------|----------|--------|-------|
| NC Digital Equity | State of NC | 2024-03-15 | $25-50k | 95% |
| Tech for Good | Duke Endowment | Rolling | $10-25k | 88% |
| Environmental Justice | EPA | 2024-04-01 | $50-100k | 72% |
