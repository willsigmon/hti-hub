#!/usr/bin/env python3
"""
HTI Reddit Monitor - NC Digital Divide Stories
Finds real stories of technology need for grant applications and impact reports
"""
import os
import praw
import pandas as pd
from datetime import datetime
from textblob import TextBlob

# NC-focused subreddits
SUBREDDITS = [
    'triangle',
    'raleigh', 
    'NorthCarolina',
    'Charlotte',
    'bullcity',
    'Greensboro',
    'winstonsalem',
    'education',
    'Teachers',
    'povertyfinance'
]

# Keywords indicating technology need
KEYWORDS = [
    'laptop', 'computer', 'chromebook', 'homework',
    'can\'t afford', 'no internet', 'wifi', 'hotspot',
    'digital divide', 'technology access', 'school device',
    'broken laptop', 'need computer', 'old computer',
    'remote learning', 'online school', 'virtual learning'
]

# Story value indicators
STORY_INDICATORS = [
    'single mom', 'single parent', 'low income', 'struggling',
    'homeless', 'unemployed', 'job search', 'resume',
    'student', 'kid', 'children', 'family', 'veteran'
]

def analyze_sentiment(text):
    """Analyze text sentiment"""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        return 'Positive'
    elif polarity < -0.1:
        return 'Negative'
    return 'Neutral'

def calculate_story_value(title, selftext):
    """Calculate how valuable this story is for HTI"""
    combined = f"{title} {selftext}".lower()
    score = 0
    
    for indicator in STORY_INDICATORS:
        if indicator in combined:
            score += 2
    
    nc_terms = ['north carolina', 'nc', 'raleigh', 'durham', 'charlotte', 'triangle', 'triad']
    for term in nc_terms:
        if term in combined:
            score += 3
            break
    
    urgency_terms = ['desperate', 'urgent', 'help', 'please', 'need', 'can\'t']
    for term in urgency_terms:
        if term in combined:
            score += 1
    
    if score >= 6:
        return 'High'
    elif score >= 3:
        return 'Medium'
    return 'Low'

def extract_use_case(title, selftext):
    """Extract potential use case category"""
    combined = f"{title} {selftext}".lower()
    
    if any(term in combined for term in ['student', 'school', 'homework', 'class']):
        return 'K-12 Student'
    elif any(term in combined for term in ['college', 'university', 'degree']):
        return 'College Student'
    elif any(term in combined for term in ['job', 'resume', 'employment', 'work from home']):
        return 'Job Seeker'
    elif any(term in combined for term in ['veteran', 'military', 'va']):
        return 'Veteran'
    elif any(term in combined for term in ['single mom', 'single parent', 'parent']):
        return 'Single Parent'
    elif any(term in combined for term in ['disabled', 'disability', 'special needs']):
        return 'Special Needs'
    return 'General Need'

def run_collector():
    """Main collector function"""
    reddit = praw.Reddit(
        client_id=os.getenv('REDDIT_CLIENT_ID'),
        client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
        user_agent='HTIAutomator/1.0'
    )
    
    results = []
    
    for subreddit_name in SUBREDDITS:
        try:
            subreddit = reddit.subreddit(subreddit_name)
            
            for keyword in KEYWORDS[:5]:
                for post in subreddit.search(keyword, limit=10, time_filter='week'):
                    story_value = calculate_story_value(post.title, post.selftext or '')
                    
                    if story_value in ['Medium', 'High']:
                        results.append({
                            'Subreddit': f'r/{subreddit_name}',
                            'Title': post.title[:100],
                            'Story_Value': story_value,
                            'Use_Case': extract_use_case(post.title, post.selftext or ''),
                            'Sentiment': analyze_sentiment(f"{post.title} {post.selftext or ''}"),
                            'Upvotes': post.score,
                            'Comments': post.num_comments,
                            'URL': f'https://reddit.com{post.permalink}',
                            'Excerpt': (post.selftext or '')[:200].replace('\n', ' '),
                            'Timestamp': datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Error processing r/{subreddit_name}: {e}")
            continue
    
    df = pd.DataFrame(results)
    if not df.empty:
        df = df.drop_duplicates(subset=['URL'])
        df = df.sort_values('Story_Value', ascending=False)
    
    os.makedirs('reports', exist_ok=True)
    filename = f"reports/digital-divide-{datetime.now().strftime('%Y-%m-%d')}.csv"
    df.to_csv(filename, index=False)
    print(f"Saved {len(df)} stories to {filename}")
    
    if not df.empty:
        print(f"\n📊 Summary:")
        print(f"  High-value stories: {len(df[df['Story_Value'] == 'High'])}")
        print(f"  Medium-value stories: {len(df[df['Story_Value'] == 'Medium'])}")
    
    return df

if __name__ == '__main__':
    run_collector()
