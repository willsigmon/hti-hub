#!/usr/bin/env python3
"""
HTI Competitive Intelligence Scraper
Uses Firecrawl to monitor similar orgs (PCs for People, Human-I-T, etc.)
Free tier optimized - only scrapes 3 pages per run
"""
import os
import requests
import pandas as pd
from datetime import datetime

FIRECRAWL_API_KEY = os.getenv('FIRECRAWL_API_KEY')
FIRECRAWL_URL = 'https://api.firecrawl.dev/v1'

# Similar organizations to monitor
SIMILAR_ORGS = [
    {
        'name': 'PCs for People',
        'url': 'https://www.pcsforpeople.org',
        'news_url': 'https://www.pcsforpeople.org/news/',
        'type': 'National competitor'
    },
    {
        'name': 'Human-I-T',
        'url': 'https://www.human-i-t.org',
        'news_url': 'https://www.human-i-t.org/blog/',
        'type': 'California competitor'
    },
    {
        'name': 'Kramden Institute',
        'url': 'https://kramden.org',
        'news_url': 'https://kramden.org/news/',
        'type': 'NC competitor'
    },
    {
        'name': 'EveryoneOn',
        'url': 'https://www.everyoneon.org',
        'news_url': 'https://www.everyoneon.org/blog/',
        'type': 'National partner potential'
    },
    {
        'name': 'Digitunity',
        'url': 'https://digitunity.org',
        'news_url': 'https://digitunity.org/news/',
        'type': 'Industry association'
    }
]

def firecrawl_scrape(url):
    """Scrape a URL with Firecrawl"""
    if not FIRECRAWL_API_KEY:
        return None
    
    try:
        response = requests.post(
            f'{FIRECRAWL_URL}/scrape',
            headers={
                'Authorization': f'Bearer {FIRECRAWL_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'url': url,
                'formats': ['markdown'],
                'onlyMainContent': True
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json().get('data', {})
        elif response.status_code == 429:
            print(f"  ⚠️ Rate limited")
        return None
    except Exception as e:
        print(f"  ⚠️ Error: {e}")
        return None

def analyze_org_activity(org, markdown):
    """Analyze scraped content for insights"""
    insights = []
    content_lower = markdown.lower()
    
    # Check for expansion signals
    if any(word in content_lower for word in ['expand', 'new location', 'launch', 'opening']):
        insights.append('Expansion activity detected')
    
    # Check for funding
    if any(word in content_lower for word in ['grant', 'funding', 'million', 'donation']):
        insights.append('Funding/grant news')
    
    # Check for partnerships
    if any(word in content_lower for word in ['partner', 'collaborate', 'join']):
        insights.append('Partnership activity')
    
    # Check for programs
    if any(word in content_lower for word in ['program', 'initiative', 'service']):
        insights.append('New programs/services')
    
    # Check for impact numbers
    import re
    numbers = re.findall(r'\d{1,3}(?:,\d{3})+|\d+(?:,\d+)*\s*(?:devices?|computers?|laptops?|families?|students?)', content_lower)
    if numbers:
        insights.append(f'Impact metrics: {numbers[:3]}')
    
    return insights if insights else ['General monitoring']

def run_collector():
    """Main collector function"""
    print("🔍 HTI Competitive Intelligence Scraper")
    print(f"   Firecrawl: {'✅ Enabled' if FIRECRAWL_API_KEY else '❌ Not configured'}")
    
    if not FIRECRAWL_API_KEY:
        print("   Skipping - no API key")
        return pd.DataFrame()
    
    results = []
    
    # Only scrape 3 orgs to conserve free tier credits
    orgs_to_scrape = SIMILAR_ORGS[:3]
    
    print(f"\n🔥 Scraping {len(orgs_to_scrape)} competitor pages...")
    
    for org in orgs_to_scrape:
        print(f"  Checking {org['name']}...")
        
        # Scrape main page
        scraped = firecrawl_scrape(org['url'])
        
        if scraped:
            markdown = scraped.get('markdown', '')
            insights = analyze_org_activity(org, markdown)
            
            results.append({
                'Organization': org['name'],
                'Type': org['type'],
                'URL': org['url'],
                'Insights': '; '.join(insights),
                'Content_Length': len(markdown),
                'Last_Scraped': datetime.now().isoformat(),
                'Status': 'Scraped'
            })
        else:
            results.append({
                'Organization': org['name'],
                'Type': org['type'],
                'URL': org['url'],
                'Insights': 'Scrape failed - check manually',
                'Content_Length': 0,
                'Last_Scraped': datetime.now().isoformat(),
                'Status': 'Failed'
            })
    
    # Add remaining orgs as watch list (not scraped)
    for org in SIMILAR_ORGS[3:]:
        results.append({
            'Organization': org['name'],
            'Type': org['type'],
            'URL': org['url'],
            'Insights': 'On watch list - not scraped this run',
            'Content_Length': 0,
            'Last_Scraped': datetime.now().isoformat(),
            'Status': 'Watch List'
        })
    
    df = pd.DataFrame(results)
    
    os.makedirs('reports', exist_ok=True)
    filename = f"reports/competitors-{datetime.now().strftime('%Y-%m-%d')}.csv"
    df.to_csv(filename, index=False)
    
    scraped_count = len(df[df['Status'] == 'Scraped'])
    print(f"\n✅ Saved {len(df)} orgs to {filename}")
    print(f"   Deep scraped: {scraped_count}")
    
    return df

if __name__ == '__main__':
    run_collector()
