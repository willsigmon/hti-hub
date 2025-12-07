# HTI H.U.B. 🚀

**HubZone Unified Brain** - Strategic dashboard + automated intelligence for HubZone Technology Initiative.

> 501(c)(3) converting donated laptops into Chromebooks for underserved NC families.
> EIN: 83-3153294

## What's Inside

### Dashboard (Next.js)
| Module | Purpose |
|--------|---------|
| 📊 **Dashboard** | Mission metrics, active campaigns, quick actions |
| 💰 **Grants** | Track applications, deadlines, funding pipeline |
| 👥 **CRM** | Donors, volunteers, partner relationships |
| 📧 **Mail** | Communications hub |
| 📅 **Calendar** | Events, deadlines, campaigns |
| 📦 **Inventory** | Device tracking and distribution |
| 💵 **Budget Gap** | Funding needs visualization |
| ⚡ **Automations** | Workflow status and triggers |

### Collectors (Python)
Automated market intelligence running daily at 7am EST:

| Collector | What It Tracks |
|-----------|---------------|
| 💰 **Grant Tracker** | Federal grants, foundation opportunities, philanthropy news |
| 📱 **Digital Divide Monitor** | Reddit stories of technology need across NC |
| 🤝 **Partner Monitor** | News about your 8 distribution partners |
| 🏢 **Competitive Scraper** | Corporate device donation programs |

### Reports Generated
- **Grant Opportunities**: High/Medium/Low relevance scoring
- **NC Digital Divide Stories**: Real stories for grant applications
- **Partner Updates**: Expansion news, funding, leadership changes
- **Email Digest**: Beautiful HTML summary sent daily

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Cron
- **Collectors**: Python 3.11, GitHub Actions
- **Mascot**: Hubby 🤖

## Setup

### Dashboard
```bash
npm install
npm run dev
```

### Collectors
Add GitHub Secrets:
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `RESEND_API_KEY`
- `DIGEST_EMAIL`

## Target Foundations
Grant tracker monitors:
- Google.org
- Microsoft Philanthropies
- T-Mobile Foundation
- State Farm Foundation
- Z. Smith Reynolds Foundation
- Kate B. Reynolds Charitable Trust
- Golden LEAF Foundation
- And more...

---

*Old Laptops. New Opportunities.*

**HubZone Technology Initiative**
