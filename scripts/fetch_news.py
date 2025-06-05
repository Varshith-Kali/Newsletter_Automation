import feedparser
import json
import re
from datetime import datetime
from typing import List, Dict
import html

# RSS Feed URLs for cybersecurity news
FEEDS = [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://krebsonsecurity.com/feed/",
    "https://nakedsecurity.sophos.com/feed",
    "https://www.darkreading.com/rss.xml",
    "https://www.schneier.com/feed/atom/",
]

def clean_html(raw_html: str) -> str:
    """Remove HTML tags and clean up text."""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext).strip()

def extract_cve(text: str) -> List[str]:
    """Extract CVE IDs from text."""
    cve_pattern = r'CVE-\d{4}-\d{4,7}'
    return re.findall(cve_pattern, text)

def summarize_text(text: str, max_length: int = 150) -> str:
    """Create a brief summary of the text."""
    # Simple summarization by taking the first sentence or truncating
    sentences = text.split('.')
    summary = sentences[0].strip()
    if len(summary) > max_length:
        summary = summary[:max_length-3] + '...'
    return summary

def process_feeds() -> Dict:
    """Process RSS feeds and generate newsletter content."""
    threats = []
    best_practices = []
    training_items = []
    
    for feed_url in FEEDS:
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:3]:  # Process top 3 entries from each feed
            # Clean and process the content
            title = clean_html(entry.title)
            content = clean_html(entry.get('summary', ''))
            
            # Extract CVEs if present
            cves = extract_cve(title + ' ' + content)
            
            # Create threat entry
            if cves:
                threat_title = f"{title} ({', '.join(cves)})"
            else:
                threat_title = title
                
            threats.append({
                "id": str(len(threats) + 1),
                "title": threat_title,
                "description": summarize_text(content)
            })
            
            # Generate best practices based on content
            if any(keyword in content.lower() for keyword in ['patch', 'update', 'vulnerability']):
                best_practices.append({
                    "id": str(len(best_practices) + 1),
                    "content": f"Update systems and apply patches related to {title}"
                })
    
    # Generate training items based on collected threats
    for i, threat in enumerate(threats[:3]):
        training_items.append({
            "id": str(i + 1),
            "content": f"Review and understand {threat['title']} - Implement preventive measures"
        })
    
    # Generate thought of the day
    thought = "SECURITY IS NOT A PRODUCT, BUT A PROCESS. STAY VIGILANT AND KEEP LEARNING."
    
    # Generate security joke
    joke = "WHY DON'T HACKERS GET SICK? BECAUSE THEY HAVE ANTI-VIRUS!"
    
    return {
        "threats": threats[:5],  # Limit to 5 threats
        "bestPractices": best_practices[:4],  # Limit to 4 best practices
        "trainingItems": training_items[:3],  # Limit to 3 training items
        "thoughtOfTheDay": thought,
        "securityJoke": joke
    }

def save_newsletter_content():
    """Save processed content to a JSON file."""
    content = process_feeds()
    
    # Save to JSON file
    with open('src/data/newsletter_content.json', 'w') as f:
        json.dump(content, f, indent=2)

if __name__ == "__main__":
    save_newsletter_content()