import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export const runtime = 'edge' // 30s timeout on Edge

const systemPrompt = `You are an AI assistant for HTI (HubZone Technology Initiative), a nonprofit focused on closing the digital divide in HubZone communities.

Key context:
- HTI has an $85,000 budget deficit projected for 2026
- Main revenue opportunities: Equipment Sales (refurbished devices), Grants, Donations, Fee-for-Service
- Equipment sales are identified as the "most fruitful opportunity"
- Key grant opportunity: NC Digital Equity Grant
- Team members: Will Sigmon (Director of BD), Mark Williams (Executive Director), Deirdre Greene (Grant Writer), Ron Taylor (Operations Manager)

Your role is to help HTI staff with:
- Strategic planning and budget scenario modeling
- Donor outreach and partnership strategies
- Grant writing and deadline tracking
- Equipment inventory and operational efficiency
- Digital literacy program coordination

Be concise, strategic, and action-oriented. Focus on practical recommendations that help close the budget gap.`

export async function POST(req: Request) {
  const { messages, memberRole } = await req.json()

  // Customize system prompt based on team member role
  let roleContext = ''
  if (memberRole?.toLowerCase().includes('business')) {
    roleContext = '\n\nYou are assisting Will Sigmon with business development, partnerships, and donor relations.'
  } else if (memberRole?.toLowerCase().includes('grant')) {
    roleContext = '\n\nYou are assisting Deirdre Greene with grant writing, applications, and deadline management.'
  } else if (memberRole?.toLowerCase().includes('operations')) {
    roleContext = '\n\nYou are assisting Ron Taylor with equipment inventory, logistics, and operational efficiency.'
  } else if (memberRole?.toLowerCase().includes('executive') || memberRole?.toLowerCase().includes('director')) {
    roleContext = '\n\nYou are assisting Mark Williams with overall strategy, digital literacy programs, and organizational leadership.'
  }

  const result = await streamText({
    model: google('gemini-2.0-flash-exp'),
    messages,
    system: systemPrompt + roleContext,
  })

  return result.toTextStreamResponse()
}
