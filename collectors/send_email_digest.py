#!/usr/bin/env python3
"""
HTI Daily Email Digest - Premium market intelligence with HTI branding
"""
import os
import glob
import pandas as pd
from datetime import datetime

def generate_email_html():
    grant_files = glob.glob('reports/grants-*.csv')
    reddit_files = glob.glob('reports/digital-divide-*.csv')
    partner_files = glob.glob('reports/partners-*.csv')

    today = datetime.now()
    date_formatted = today.strftime('%B %d, %Y')

    html = f'''
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #f58420 0%, #fdb715 100%); padding: 40px 20px; }}
        .container {{ max-width: 680px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }}
        .header {{ background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 48px 40px; text-align: center; }}
        .logo {{ font-size: 48px; margin-bottom: 8px; }}
        .brand {{ color: #f58420; font-size: 16px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }}
        .header h1 {{ color: #fff; font-size: 28px; font-weight: 700; margin: 8px 0; }}
        .subtitle {{ color: rgba(255,255,255,0.7); font-size: 15px; }}
        .content {{ padding: 40px; }}
        .section {{ margin-bottom: 40px; }}
        .section-header {{ display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 3px solid #f58420; }}
        .section-icon {{ font-size: 28px; margin-right: 12px; }}
        .section-title {{ font-size: 22px; font-weight: 700; color: #1a1a1a; }}
        .card {{ background: #f5f5f7; border-radius: 16px; padding: 20px; margin-bottom: 16px; }}
        .card.highlight {{ background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-left: 5px solid #f58420; }}
        .card-title {{ font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }}
        .card-meta {{ font-size: 13px; color: #666; margin-bottom: 4px; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }}
        .badge-high {{ background: linear-gradient(135deg, #f58420 0%, #fdb715 100%); color: white; }}
        .badge-medium {{ background: #e0e0e0; color: #333; }}
        .stats-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }}
        .stat-card {{ background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; padding: 20px; text-align: center; color: white; }}
        .stat-value {{ font-size: 32px; font-weight: 800; color: #f58420; }}
        .stat-label {{ font-size: 11px; opacity: 0.85; text-transform: uppercase; }}
        .footer {{ background: #1a1a1a; padding: 32px 40px; text-align: center; }}
        .footer-brand {{ color: #f58420; font-size: 14px; font-weight: 600; margin-bottom: 16px; }}
        .footer-text {{ color: rgba(255,255,255,0.4); font-size: 12px; }}
        @media (max-width: 600px) {{ .stats-grid {{ grid-template-columns: 1fr; }} .content {{ padding: 24px; }} }}
    </style></head>
    <body><div class="container">
        <div class="header">
            <div class="logo">💻</div>
            <div class="brand">HubZone Tech Initiative</div>
            <h1>Market Intelligence</h1>
            <div class="subtitle">{date_formatted}</div>
        </div>
        <div class="content">
    '''

    # Grants Section
    if grant_files:
        df = pd.read_csv(grant_files[-1])
        high = df[df['Relevance'] == 'High']
        html += '''<div class="section"><div class="section-header"><span class="section-icon">💰</span><span class="section-title">Grant Opportunities</span></div>'''
        for _, row in (high.head(5) if len(high) > 0 else df.head(5)).iterrows():
            is_high = row['Relevance'] == 'High'
            html += f'''<div class="card {'highlight' if is_high else ''}"><span class="badge {'badge-high' if is_high else 'badge-medium'}">{row['Relevance']}</span><div class="card-title" style="margin-top:10px">{str(row['Title'])[:80]}...</div><div class="card-meta">Source: {row['Source']} • Deadline: {row['Deadline']}</div></div>'''
        html += '</div>'

    # Digital Divide Section
    if reddit_files:
        df = pd.read_csv(reddit_files[-1])
        if not df.empty:
            high_val = len(df[df['Story_Value'] == 'High'])
            html += f'''<div class="section"><div class="section-header"><span class="section-icon">📱</span><span class="section-title">NC Digital Divide Stories</span></div>
            <div class="stats-grid"><div class="stat-card"><div class="stat-value">{high_val}</div><div class="stat-label">High Value</div></div>
            <div class="stat-card"><div class="stat-value">{len(df)}</div><div class="stat-label">Total</div></div>
            <div class="stat-card"><div class="stat-value">{df['Use_Case'].nunique()}</div><div class="stat-label">Use Cases</div></div></div>'''
            for _, row in df.head(3).iterrows():
                html += f'''<div class="card"><span class="badge {'badge-high' if row['Story_Value']=='High' else 'badge-medium'}">{row['Story_Value']}</span><div class="card-title" style="margin-top:10px">{row['Title']}</div><div class="card-meta">{row['Subreddit']} • {row['Use_Case']}</div></div>'''
            html += '</div>'

    # Partner Section
    if partner_files:
        df = pd.read_csv(partner_files[-1])
        news = df[df['Type'] == 'News Mention']
        if len(news) > 0:
            html += '''<div class="section"><div class="section-header"><span class="section-icon">🤝</span><span class="section-title">Partner Updates</span></div>'''
            for _, row in news.head(4).iterrows():
                html += f'''<div class="card"><div class="card-title">{row['Partner']}</div><div class="card-meta">{str(row['Title'])[:60]}...</div></div>'''
            html += '</div>'

    html += '''</div><div class="footer"><div class="footer-brand">HubZone Technology Initiative</div><div class="footer-text">Old Laptops. New Opportunities.<br>501(c)(3) EIN: 83-3153294</div></div></div></body></html>'''
    return html

def send_email():
    import requests
    api_key = os.getenv('RESEND_API_KEY')
    to_email = os.getenv('DIGEST_EMAIL', 'wsigmon@hubzonetech.org')
    if not api_key:
        print("RESEND_API_KEY not set")
        return
    
    response = requests.post('https://api.resend.com/emails',
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        json={'from': 'HTI Intelligence <reports@resend.dev>', 'to': [to_email],
              'subject': f"💻 HTI Market Intelligence — {datetime.now().strftime('%b %d')}",
              'html': generate_email_html()})
    
    print(f"{'✅' if response.status_code == 200 else '❌'} Email {'sent to ' + to_email if response.status_code == 200 else 'failed: ' + response.text}")

if __name__ == '__main__':
    send_email()
