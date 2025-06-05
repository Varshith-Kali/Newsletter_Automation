import feedparser
import json
import re
from datetime import datetime
from typing import List, Dict
import html
from transformers import pipeline
import os
import nltk
from nltk.tokenize import sent_tokenize

# Download required NLTK data
nltk.download('punkt', quiet=True)

# Initialize the summarization pipeline with a lightweight model
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=-1  # Use CPU
)

# Initialize text classification for threat detection
classifier = pipeline(
    "text-classification",
    model="microsoft/deberta-v3-small",
    device=-1  # Use CPU
)

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

def smart_summarize(text: str, max_length: int = 150) -> str:
    """Create an intelligent summary using the BART model."""
    try:
        # Clean and prepare text
        text = text.replace('\n', ' ').strip()
        
        # If text is short enough, return as is
        if len(text) <= max_length:
            return text
        
        # Generate summary
        summary = summarizer(text, max_length=max_length, min_length=50, do_sample=False)[0]['summary_text']
        return summary.strip()
    except Exception as e:
        print(f"Summarization error: {e}")
        # Fallback to simple summarization
        sentences = sent_tokenize(text)
        return sentences[0][:max_length] + '...' if len(sentences[0]) > max_length else sentences[0]

def analyze_severity(text: str) -> str:
    """Analyze the severity of a security threat."""
    try:
        result = classifier(text)[0]
        # Map classification confidence to severity
        if result['score'] > 0.8:
            return "CRITICAL"
        elif result['score'] > 0.6:
            return "HIGH"
        elif result['score'] > 0.4:
            return "MEDIUM"
        else:
            return "LOW"
    except Exception as e:
        print(f"Classification error: {e}")
        return "UNKNOWN"

def generate_best_practice(threat: Dict) -> str:
    """Generate a best practice recommendation based on the threat."""
    severity = analyze_severity(threat['title'] + ' ' + threat['description'])
    
    if 'patch' in threat['description'].lower() or 'update' in threat['description'].lower():
        return f"PRIORITY {severity}: Apply security patches and updates immediately for {threat['title'].split('(')[0].strip()}"
    elif 'authentication' in threat['description'].lower() or 'credentials' in threat['description'].lower():
        return f"PRIORITY {severity}: Strengthen authentication mechanisms and implement MFA where possible"
    else:
        return f"PRIORITY {severity}: Monitor and assess your exposure to {threat['title'].split('(')[0].strip()}"

def process_feeds() -> Dict:
    """Process RSS feeds and generate newsletter content."""
    threats = []
    best_practices = []
    training_items = []
    
    for feed_url in FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            
            for entry in feed.entries[:3]:
                # Clean and process the content
                title = clean_html(entry.title)
                content = clean_html(entry.get('summary', ''))
                
                # Extract CVEs if present
                cves = extract_cve(title + ' ' + content)
                
                # Create threat entry
                threat = {
                    "id": str(len(threats) + 1),
                    "title": f"{title} ({', '.join(cves)})" if cves else title,
                    "description": smart_summarize(content)
                }
                threats.append(threat)
                
                # Generate best practice
                best_practices.append({
                    "id": str(len(best_practices) + 1),
                    "content": generate_best_practice(threat)
                })
        except Exception as e:
            print(f"Error processing feed {feed_url}: {e}")
            continue
    
    # Generate training items based on collected threats
    for i, threat in enumerate(threats[:3]):
        severity = analyze_severity(threat['title'] + ' ' + threat['description'])
        training_items.append({
            "id": str(i + 1),
            "content": f"[{severity}] Security training: Understanding and mitigating {threat['title'].split('(')[0].strip()}"
        })
    
    # Generate thought of the day using collected insights
    thought = "CYBERSECURITY IS A JOURNEY, NOT A DESTINATION. EACH NEW THREAT IS AN OPPORTUNITY TO STRENGTHEN OUR DEFENSES."
    
    # Generate security joke
    jokes = [
        "WHY DON'T HACKERS GET SICK? BECAUSE THEY HAVE ANTI-VIRUS!",
        "WHAT'S A HACKER'S FAVORITE SEASON? PHISHING SEASON!",
        "WHY DID THE FIREWALL FEEL LONELY? BECAUSE IT HAD TOO MANY BLOCKS!",
        "WHAT'S A CYBERSECURITY EXPERT'S FAVORITE GAME? PATCH AND SEEK!"
    ]
    from random import choice
    joke = choice(jokes)
    
    return {
        "threats": threats[:5],  # Limit to 5 threats
        "bestPractices": best_practices[:4],  # Limit to 4 best practices
        "trainingItems": training_items[:3],  # Limit to 3 training items
        "thoughtOfTheDay": thought,
        "securityJoke": joke
    }

def save_newsletter_content():
    """Save processed content to a JSON file."""
    # Create data directory if it doesn't exist
    os.makedirs('src/data', exist_ok=True)
    
    content = process_feeds()
    
    # Save to JSON file
    with open('src/data/newsletter_content.json', 'w') as f:
        json.dump(content, f, indent=2)

if __name__ == "__main__":
    save_newsletter_content()