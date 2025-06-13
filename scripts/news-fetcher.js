import Parser from 'rss-parser';
import fetch from 'node-fetch';

const parser = new Parser();

// Cybersecurity RSS feeds
const RSS_FEEDS = [
  'https://feeds.feedburner.com/TheHackersNews',
  'https://krebsonsecurity.com/feed/',
  'https://www.bleepingcomputer.com/feed/',
  'https://threatpost.com/feed/',
  'https://www.darkreading.com/rss.xml',
  'https://www.securityweek.com/feed',
  'https://www.infosecurity-magazine.com/rss/news/',
  'https://www.csoonline.com/index.rss',
  'https://www.scmagazine.com/feed',
  'https://cybersecuritynews.com/feed/'
];

export async function fetchCyberSecurityNews() {
  const allArticles = [];
  
  console.log('🔍 Fetching cybersecurity news from multiple sources...');
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching from: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      const articles = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        description: item.contentSnippet || item.description,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.title || feedUrl,
        content: item.content || item.description
      }));
      
      allArticles.push(...articles);
    } catch (error) {
      console.warn(`⚠️ Failed to fetch from ${feedUrl}:`, error.message);
    }
  }
  
  console.log(`✅ Fetched ${allArticles.length} articles total`);
  return allArticles.slice(0, 20); // Limit to 20 most recent
}

export async function summarizeWithHuggingFace(text, maxLength = 150) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text.substring(0, 1000), // Limit input length
        parameters: {
          max_length: maxLength,
          min_length: 50,
          do_sample: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result[0]?.summary_text || text.substring(0, maxLength);
  } catch (error) {
    console.warn('⚠️ Summarization failed, using truncated text:', error.message);
    return text.substring(0, maxLength) + '...';
  }
}

export function extractCVEs(text) {
  const cveRegex = /CVE-\d{4}-\d{4,7}/gi;
  return text.match(cveRegex) || [];
}

export function classifyThreatSeverity(title, description) {
  const criticalKeywords = ['zero-day', 'critical', 'remote code execution', 'rce', 'privilege escalation'];
  const highKeywords = ['vulnerability', 'exploit', 'breach', 'ransomware', 'malware'];
  const mediumKeywords = ['phishing', 'scam', 'update', 'patch'];
  
  const text = (title + ' ' + description).toLowerCase();
  
  if (criticalKeywords.some(keyword => text.includes(keyword))) {
    return 'CRITICAL';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'HIGH';
  } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 'MEDIUM';
  }
  return 'LOW';
}

export function generateBestPractices(threats) {
  const practices = [
    'Implement multi-factor authentication across all critical systems and applications.',
    'Maintain regular security patches and updates for all software components.',
    'Conduct regular security awareness training for all employees.',
    'Establish network segmentation to limit lateral movement of threats.',
    'Deploy endpoint detection and response (EDR) solutions.',
    'Maintain offline backups and test recovery procedures regularly.',
    'Monitor and log all network traffic and system activities.',
    'Implement zero-trust architecture principles.',
    'Regular vulnerability assessments and penetration testing.',
    'Establish incident response procedures and communication plans.'
  ];
  
  // Select random practices based on threat count
  const count = Math.min(threats.length, 4);
  return practices.slice(0, count).map((practice, index) => ({
    id: (index + 1).toString(),
    content: practice
  }));
}

export function generateTrainingItems(threats) {
  const trainingTopics = [
    'Phishing recognition and reporting procedures for all staff members.',
    'Secure coding practices workshop for development teams.',
    'Incident response simulation exercises and tabletop scenarios.',
    'Social engineering awareness and prevention techniques.',
    'Password security and credential management best practices.',
    'Mobile device security and BYOD policy compliance.',
    'Cloud security fundamentals and configuration management.',
    'Data classification and handling procedures training.'
  ];
  
  const count = Math.min(threats.length, 3);
  return trainingTopics.slice(0, count).map((topic, index) => ({
    id: (index + 1).toString(),
    content: topic
  }));
}

export function generateSecurityThought() {
  const thoughts = [
    'IN CYBERSECURITY, PARANOIA IS A VIRTUE. THE QUESTION ISN\'T "IF" BUT "WHEN" - SO BUILD WALLS TODAY THAT WITHSTAND TOMORROW\'S SIEGE.',
    'SECURITY IS NOT A PRODUCT, BUT A PROCESS. IT\'S NOT A DESTINATION, BUT A JOURNEY OF CONTINUOUS VIGILANCE.',
    'THE WEAKEST LINK IN SECURITY IS OFTEN THE HUMAN ELEMENT. INVEST IN PEOPLE AS MUCH AS TECHNOLOGY.',
    'ASSUME BREACH: PLAN FOR FAILURE, PREPARE FOR SUCCESS, AND ALWAYS HAVE A BACKUP PLAN.',
    'CYBERSECURITY IS EVERYONE\'S RESPONSIBILITY, NOT JUST THE IT DEPARTMENT\'S PROBLEM.',
    'THE BEST DEFENSE IS A GOOD OFFENSE: KNOW YOUR ENEMY BEFORE THEY KNOW YOU.',
    'IN THE DIGITAL AGE, YOUR DATA IS YOUR MOST VALUABLE ASSET. PROTECT IT LIKE YOUR LIFE DEPENDS ON IT.'
  ];
  
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

export function generateSecurityJoke() {
  const jokes = [
    'WHY DID THE CYBERSECURITY EXPERT BRING A LADDER TO WORK? TO CLIMB THE FIREWALL!',
    'HOW MANY CYBERSECURITY EXPERTS DOES IT TAKE TO CHANGE A LIGHT BULB? NONE - THEY JUST DECLARE IT A SECURITY FEATURE!',
    'WHY DON\'T HACKERS EVER GET LOCKED OUT? THEY ALWAYS HAVE A BACKDOOR!',
    'WHAT DO YOU CALL A SECURITY GUARD AT A SAMSUNG STORE? A GUARDIAN OF THE GALAXY!',
    'WHY DID THE PASSWORD GO TO THERAPY? IT HAD TOO MANY COMPLEX ISSUES!',
    'WHAT\'S A HACKER\'S FAVORITE TYPE OF MUSIC? ALGO-RHYTHMS!',
    'WHY DON\'T CYBERSECURITY EXPERTS TRUST STAIRS? THEY\'RE ALWAYS UP TO SOMETHING!'
  ];
  
  return jokes[Math.floor(Math.random() * jokes.length)];
}