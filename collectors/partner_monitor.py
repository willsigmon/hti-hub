#!/usr/bin/env python3
"""
HTI Partner Organization Monitor
Tracks your 8 distribution partners for opportunities
"""
import os
import pandas as pd
from datetime import datetime
import feedparser

PARTNERS = [
    {'name': 'YMCA of the Triangle', 'website': 'https://www.ymcatriangle.org', 'focus': 'Youth programs'},
    {'name': 'Boys & Girls Club Durham', 'website': 'https://www.bgcdurham.org', 'focus': 'Youth development'},
    {'name': 'Salvation Army NC', 'website': 'https://salvationarmycarolinas.org', 'focus': 'Family services'},
    {'name': 'Easterseals UCP NC', 'website': 'https://www.eastersealsucp.com', 'focus': 'Disability services'},
    {'name': 'Veterans Life Center NC', 'website': 'https://veteranslifecenter.org', 'focus': 'Veteran support'},
    {'name': 'Passage Home', 'website': 'https://passagehome.org', 'focus': 'Housing assistance'},
    {'name': 'Step Up Ministry', 'website': 'https://stepupministry.org', 'focus': 'Job training'},
    {'name': 'Raleigh Dream Center', 'website': 'https://raleighdreamcenter.org', 'focus': 'Community outreach'}
]

def search_partner_news(partner):
    """Search Google News for partner mentions"""
    results = []
    search_query = f"{partner['name']} North Carolina"
    rss_url = f"https://news.google.com/rss/search?q={search_query.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
    
    try:
        feed = feedparser.parse(rss_url)
        for entry in feed.entries[:5]:
            results.append({
                'Partner': partner['name'],
                'Type': 'News Mention',
                'Title': entry.title,
                'Summary': entry.get('summary', '')[:200],
                'URL': entry.link,
                'Date': entry.get('published', 'Unknown'),
                'Opportunity_Type': categorize_opportunity(entry.title, entry.get('summary', '')),
                'Timestamp': datetime.now().isoformat()
            })
    except Exception as e:
        print(f"Error searching news for {partner['name']}: {e}")
    
    return results

def categorize_opportunity(title, summary):
    """Categorize opportunity type"""
    combined = f"{title} {summary}".lower()
    
    if any(term in combined for term in ['expand', 'new location', 'open', 'launch']):
        return 'Expansion'
    elif any(term in combined for term in ['grant', 'funding', 'donation', 'million']):
        return 'Funding News'
    elif any(term in combined for term in ['partnership', 'partner', 'collaborate']):
        return 'Partnership'
    elif any(term in combined for term in ['event', 'fundraiser', 'gala']):
        return 'Event'
    elif any(term in combined for term in ['hire', 'director', 'ceo', 'leadership']):
        return 'Leadership Change'
    return 'General News'

def run_collector():
    """Main collector function"""
    print("🤝 Monitoring partner organizations...")
    
    all_results = []
    
    for partner in PARTNERS:
        print(f"  Checking {partner['name']}...")
        news = search_partner_news(partner)
        all_results.extend(news)
        
        all_results.append({
            'Partner': partner['name'],
            'Type': 'Partner Profile',
            'Title': f"Focus: {partner['focus']}",
            'Summary': f"Website: {partner['website']}",
            'URL': partner['website'],
            'Date': 'Ongoing',
            'Opportunity_Type': 'Reference',
            'Timestamp': datetime.now().isoformat()
        })
    
    df = pd.DataFrame(all_results)
    if not df.empty:
        type_order = {'Expansion': 0, 'Funding News': 1, 'Partnership': 2, 'Event': 3, 'Leadership Change': 4, 'General News': 5, 'Reference': 6}
        df['_sort'] = df['Opportunity_Type'].map(type_order)
        df = df.sort_values('_sort').drop('_sort', axis=1)
    
    os.makedirs('reports', exist_ok=True)
    filename = f"reports/partners-{datetime.now().strftime('%Y-%m-%d')}.csv"
    df.to_csv(filename, index=False)
    print(f"\n✅ Saved {len(df)} partner updates to {filename}")
    
    return df

if __name__ == '__main__':
    run_collector()
