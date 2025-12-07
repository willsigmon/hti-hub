#!/usr/bin/env python3
"""
HTI Grant Opportunity Tracker v2
Now with Firecrawl for deep grant page scraping (free tier optimized)
"""
import os
import requests
import pandas as pd
from datetime import datetime
import feedparser
import json

FIRECRAWL_API_KEY = os.getenv('FIRECRAWL_API_KEY')
FIRECRAWL_URL = 'https://api.firecrawl.dev/v1'

KEYWORDS = [
    'digital equity', 'digital divide', 'technology access',
    'computer donation', 'digital literacy', 'education technology',
    'broadband access', 'nonprofit technology', 'underserved communities'
]

TARGET_FOUNDATIONS = [
    {'name': 'Google.org', 'url': 'https://www.google.org/grants/'},
    {'name': 'Microsoft Philanthropies', 'url': 'https://www.microsoft.com/en-us/corporate-responsibility/philanthropies'},
    {'name': 'T-Mobile Foundation', 'url': 'https://www.t-mobile.com/responsibility/community/t-mobile-foundation'},
    {'name': 'State Farm Foundation', 'url': 'https://www.statefarm.com/about-us/corporate-responsibility/community-grants'},
    {'name': 'Duke Energy Foundation', 'url': 'https://www.duke-energy.com/community/duke-energy-foundation'},
    {'name': 'Z. Smith Reynolds Foundation', 'url': 'https://www.zsr.org/grants'},
    {'name': 'Kate B. Reynolds Charitable Trust', 'url': 'https://kbrct.org/apply/'},
    {'name': 'Golden LEAF Foundation', 'url': 'https://www.goldenleaf.org/grants/'},
    {'name': 'Blue Cross NC Foundation', 'url': 'https://www.bcbsncfoundation.org/grants/'}
]

def firecrawl_scrape(url, extract_schema=None):
    """Scrape a URL with Firecrawl (conserve free tier credits)"""
    if not FIRECRAWL_API_KEY:
        return None
    
    try:
        payload = {
            'url': url,
            'formats': ['markdown'],
            'onlyMainContent': True
        }
        
        # If we want structured extraction
        if extract_schema:
            payload['extract'] = {'schema': extract_schema}
        
        response = requests.post(
            f'{FIRECRAWL_URL}/scrape',
            headers={
                'Authorization': f'Bearer {FIRECRAWL_API_KEY}',
                'Content-Type': 'application/json'
            },
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('data', {})
        elif response.status_code == 429:
            print(f"  ⚠️ Firecrawl rate limit - skipping deep scrape")
            return None
        else:
            print(f"  ⚠️ Firecrawl error {response.status_code}")
            return None
            
    except Exception as e:
        print(f"  ⚠️ Firecrawl failed: {e}")
        return None

def extract_grant_details(url):
    """Use Firecrawl to extract structured grant info"""
    schema = {
        'type': 'object',
        'properties': {
            'grant_name': {'type': 'string'},
            'deadline': {'type': 'string'},
            'amount_min': {'type': 'string'},
            'amount_max': {'type': 'string'},
            'eligibility': {'type': 'string'},
            'focus_areas': {'type': 'array', 'items': {'type': 'string'}},
            'application_url': {'type': 'string'}
        }
    }
    
    result = firecrawl_scrape(url, extract_schema=schema)
    if result and result.get('extract'):
        return result['extract']
    return None

def search_grants_gov():
    """Search Grants.gov for relevant opportunities"""
    results = []
    base_url = 'https://www.grants.gov/grantsws/rest/opportunities/search'
    
    for keyword in KEYWORDS[:3]:  # Limit API calls
        try:
            params = {'keyword': keyword, 'oppStatuses': 'forecasted|posted', 'rows': 15}
            response = requests.get(base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                for opp in data.get('oppHits', []):
                    results.append({
                        'Source': 'Grants.gov',
                        'Title': opp.get('title', 'Unknown'),
                        'Agency': opp.get('agencyCode', 'Unknown'),
                        'Amount': opp.get('awardCeiling', 'Not specified'),
                        'Deadline': opp.get('closeDate', 'Open'),
                        'Status': opp.get('oppStatus', 'Unknown'),
                        'URL': f"https://www.grants.gov/search-results-detail/{opp.get('id', '')}",
                        'Relevance': calculate_relevance(opp.get('title', ''), opp.get('synopsis', '')),
                        'Deep_Scrape': False,
                        'Timestamp': datetime.now().isoformat()
                    })
        except Exception as e:
            print(f"Error searching Grants.gov: {e}")
    
    return results

def scrape_foundation_pages():
    """Use Firecrawl to scrape foundation grant pages (limit to save credits)"""
    results = []
    
    # Only scrape top 3 foundations to conserve free tier
    foundations_to_scrape = TARGET_FOUNDATIONS[:3]
    
    print(f"\n🔥 Deep scraping {len(foundations_to_scrape)} foundation pages with Firecrawl...")
    
    for foundation in foundations_to_scrape:
        print(f"  Scraping {foundation['name']}...")
        
        scraped = firecrawl_scrape(foundation['url'])
        
        if scraped:
            markdown = scraped.get('markdown', '')
            
            # Extract key info from markdown
            has_deadline = any(word in markdown.lower() for word in ['deadline', 'due date', 'submit by'])
            has_amount = any(word in markdown.lower() for word in ['$', 'award', 'grant amount', 'funding'])
            
            results.append({
                'Source': 'Firecrawl Deep Scrape',
                'Title': f"{foundation['name']} - Grant Opportunities",
                'Agency': foundation['name'],
                'Amount': 'See page for details' if has_amount else 'Not specified',
                'Deadline': 'Active deadlines found' if has_deadline else 'Rolling/Unknown',
                'Status': 'Live Page',
                'URL': foundation['url'],
                'Relevance': 'High',
                'Deep_Scrape': True,
                'Content_Preview': markdown[:500] if markdown else 'No content',
                'Timestamp': datetime.now().isoformat()
            })
        else:
            # Fallback - just add the foundation to watch list
            results.append({
                'Source': 'Foundation Watch List',
                'Title': f"{foundation['name']} - Monitor for opportunities",
                'Agency': foundation['name'],
                'Amount': 'Varies',
                'Deadline': 'Check website',
                'Status': 'Watch List',
                'URL': foundation['url'],
                'Relevance': 'High',
                'Deep_Scrape': False,
                'Timestamp': datetime.now().isoformat()
            })
    
    # Add remaining foundations as watch list (no scraping to save credits)
    for foundation in TARGET_FOUNDATIONS[3:]:
        results.append({
            'Source': 'Foundation Watch List',
            'Title': f"{foundation['name']} - Monitor for opportunities",
            'Agency': foundation['name'],
            'Amount': 'Varies',
            'Deadline': 'Check website',
            'Status': 'Watch List',
            'URL': foundation['url'],
            'Relevance': 'High',
            'Deep_Scrape': False,
            'Timestamp': datetime.now().isoformat()
        })
    
    return results

def search_philanthropy_news():
    """Search philanthropy news RSS (free, no API needed)"""
    results = []
    feeds = ['https://philanthropynewsdigest.org/news.rss']
    
    for feed_url in feeds:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:15]:
                title_lower = entry.title.lower()
                if any(kw in title_lower for kw in ['digital', 'technology', 'computer', 'education', 'equity', 'grant']):
                    results.append({
                        'Source': 'Philanthropy News',
                        'Title': entry.title,
                        'Agency': 'Various',
                        'Amount': 'See article',
                        'Deadline': 'See article',
                        'Status': 'News',
                        'URL': entry.link,
                        'Relevance': 'Medium',
                        'Deep_Scrape': False,
                        'Timestamp': datetime.now().isoformat()
                    })
        except Exception as e:
            print(f"Error parsing feed: {e}")
    
    return results

def calculate_relevance(title, description):
    """Calculate grant relevance to HTI"""
    combined = f"{title} {description}".lower()
    score = 0
    
    high_value = ['digital equity', 'digital divide', 'computer', 'chromebook', 'laptop', 'device']
    for kw in high_value:
        if kw in combined:
            score += 3
    
    med_value = ['technology', 'education', 'underserved', 'low-income', 'rural', 'broadband']
    for kw in med_value:
        if kw in combined:
            score += 2
    
    if 'north carolina' in combined or ' nc ' in combined:
        score += 5
    
    if score >= 8:
        return 'High'
    elif score >= 4:
        return 'Medium'
    return 'Low'

def run_collector():
    """Main collector function"""
    print("🔍 HTI Grant Tracker v2 (Firecrawl Enhanced)")
    print(f"   Firecrawl: {'✅ Enabled' if FIRECRAWL_API_KEY else '❌ Not configured'}")
    
    all_results = []
    
    # 1. Grants.gov API (free)
    print("\n📡 Searching Grants.gov...")
    all_results.extend(search_grants_gov())
    
    # 2. Philanthropy News RSS (free)
    print("\n📰 Checking philanthropy news...")
    all_results.extend(search_philanthropy_news())
    
    # 3. Foundation pages with Firecrawl (uses credits - limited)
    if FIRECRAWL_API_KEY:
        all_results.extend(scrape_foundation_pages())
    else:
        print("\n⚠️ Skipping deep scrape - no Firecrawl API key")
        for foundation in TARGET_FOUNDATIONS:
            all_results.append({
                'Source': 'Foundation Watch List',
                'Title': f"{foundation['name']} - Monitor for opportunities",
                'Agency': foundation['name'],
                'Amount': 'Varies',
                'Deadline': 'Check website',
                'Status': 'Watch List',
                'URL': foundation['url'],
                'Relevance': 'High',
                'Deep_Scrape': False,
                'Timestamp': datetime.now().isoformat()
            })
    
    # Create DataFrame
    df = pd.DataFrame(all_results)
    if not df.empty:
        df = df.drop_duplicates(subset=['Title', 'Source'])
        relevance_order = {'High': 0, 'Medium': 1, 'Low': 2}
        df['_sort'] = df['Relevance'].map(relevance_order)
        df = df.sort_values('_sort').drop('_sort', axis=1)
    
    # Save report
    os.makedirs('reports', exist_ok=True)
    filename = f"reports/grants-{datetime.now().strftime('%Y-%m-%d')}.csv"
    df.to_csv(filename, index=False)
    
    # Summary
    deep_scraped = len(df[df.get('Deep_Scrape', False) == True]) if 'Deep_Scrape' in df.columns else 0
    print(f"\n✅ Saved {len(df)} opportunities to {filename}")
    print(f"   High relevance: {len(df[df['Relevance'] == 'High'])}")
    print(f"   Deep scraped: {deep_scraped}")
    
    return df

if __name__ == '__main__':
    run_collector()
