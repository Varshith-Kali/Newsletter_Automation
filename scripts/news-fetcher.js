import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const parser = new Parser();

// Enhanced cybersecurity RSS feeds with more sources
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
  'https://cybersecuritynews.com/feed/',
  'https://www.cyberscoop.com/feed/',
  'https://www.zdnet.com/topic/security/rss.xml',
  'https://www.securitymagazine.com/rss/topic/2236-cyber-security',
  'https://www.helpnetsecurity.com/feed/',
  'https://www.recordedfuture.com/feed',
  'https://www.bankinfosecurity.com/rss.php',
  'https://www.govinfosecurity.com/rss.php',
  'https://feeds.feedburner.com/eset/blog',
  'https://blog.malwarebytes.com/feed/',
  'https://www.welivesecurity.com/feed/'
];

// Mapping of RSS feed URLs to their main website URLs for reliable linking
const FEED_TO_WEBSITE_MAP = {
  'https://feeds.feedburner.com/TheHackersNews': 'https://thehackernews.com',
  'https://krebsonsecurity.com/feed/': 'https://krebsonsecurity.com',
  'https://www.bleepingcomputer.com/feed/': 'https://www.bleepingcomputer.com',
  'https://threatpost.com/feed/': 'https://threatpost.com',
  'https://www.darkreading.com/rss.xml': 'https://www.darkreading.com',
  'https://www.securityweek.com/feed': 'https://www.securityweek.com',
  'https://www.infosecurity-magazine.com/rss/news/': 'https://www.infosecurity-magazine.com',
  'https://www.csoonline.com/index.rss': 'https://www.csoonline.com',
  'https://www.scmagazine.com/feed': 'https://www.scmagazine.com',
  'https://cybersecuritynews.com/feed/': 'https://cybersecuritynews.com',
  'https://www.cyberscoop.com/feed/': 'https://www.cyberscoop.com',
  'https://www.zdnet.com/topic/security/rss.xml': 'https://www.zdnet.com/topic/security/',
  'https://www.securitymagazine.com/rss/topic/2236-cyber-security': 'https://www.securitymagazine.com',
  'https://www.helpnetsecurity.com/feed/': 'https://www.helpnetsecurity.com',
  'https://www.recordedfuture.com/feed': 'https://www.recordedfuture.com',
  'https://www.bankinfosecurity.com/rss.php': 'https://www.bankinfosecurity.com',
  'https://www.govinfosecurity.com/rss.php': 'https://www.govinfosecurity.com',
  'https://feeds.feedburner.com/eset/blog': 'https://www.welivesecurity.com',
  'https://blog.malwarebytes.com/feed/': 'https://blog.malwarebytes.com',
  'https://www.welivesecurity.com/feed/': 'https://www.welivesecurity.com'
};

const CACHE_FILE = 'src/data/news-cache.json';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Load cached data
function loadCache() {
  if (!existsSync(CACHE_FILE)) {
    return { articles: [], lastCleanup: Date.now() };
  }
  
  try {
    const data = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
    return data;
  } catch (error) {
    console.warn('⚠️ Failed to load cache, starting fresh');
    return { articles: [], lastCleanup: Date.now() };
  }
}

// Save cache data
function saveCache(data) {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('⚠️ Failed to save cache:', error.message);
  }
}

// Clean old articles (older than 7 days)
function cleanOldArticles(articles) {
  const sevenDaysAgo = Date.now() - CACHE_DURATION;
  return articles.filter(article => {
    const articleDate = new Date(article.pubDate).getTime();
    return articleDate > sevenDaysAgo;
  });
}

// Remove duplicates based on title similarity and URL
function removeDuplicates(articles) {
  const seen = new Set();
  const unique = [];
  
  for (const article of articles) {
    // Create a normalized key for duplicate detection
    const normalizedTitle = article.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const key = `${normalizedTitle}_${article.link}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }
  
  return unique;
}

// Enhanced date validation - strictly past 7 days only
function isStrictlyRecentArticle(pubDate) {
  if (!pubDate) return false;
  
  const articleDate = new Date(pubDate);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - CACHE_DURATION);
  
  // Ensure the article is within the last 7 days and not in the future
  return articleDate > sevenDaysAgo && articleDate <= now;
}

// Format date for display
function formatArticleDate(pubDate) {
  if (!pubDate) return 'Date unknown';
  
  const date = new Date(pubDate);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  
  if (diffDays === 0) {
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays} days ago`;
  }
}

// Get reliable website URL for a feed
function getReliableWebsiteUrl(feedUrl, originalLink) {
  // First try to use the mapped website URL
  const mappedUrl = FEED_TO_WEBSITE_MAP[feedUrl];
  if (mappedUrl) {
    return mappedUrl;
  }
  
  // If original link exists and looks valid, try to extract domain
  if (originalLink && originalLink.startsWith('http')) {
    try {
      const url = new URL(originalLink);
      return `${url.protocol}//${url.hostname}`;
    } catch (error) {
      console.warn('⚠️ Could not parse original link:', originalLink);
    }
  }
  
  // Fallback to extracting domain from feed URL
  try {
    const url = new URL(feedUrl);
    return `${url.protocol}//${url.hostname}`;
  } catch (error) {
    console.warn('⚠️ Could not parse feed URL:', feedUrl);
    return 'https://www.cisa.gov/news-events/alerts'; // Ultimate fallback
  }
}

export async function fetchCyberSecurityNews() {
  console.log('🔍 Fetching STRICTLY latest cybersecurity news from past 7 days...');
  console.log(`📅 Current time: ${new Date().toISOString()}`);
  console.log(`📅 Cutoff time: ${new Date(Date.now() - CACHE_DURATION).toISOString()}`);
  
  // Load existing cache
  let cache = loadCache();
  
  // Clean old articles from cache
  cache.articles = cleanOldArticles(cache.articles);
  
  const newArticles = [];
  let totalFetched = 0;
  let validArticles = 0;
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching from: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      const recentArticles = feed.items
        .filter(item => {
          const isRecent = isStrictlyRecentArticle(item.pubDate);
          if (isRecent) {
            console.log(`✅ Valid article: ${item.title} - ${formatArticleDate(item.pubDate)}`);
          }
          return isRecent;
        })
        .slice(0, 8) // Limit per feed to avoid overwhelming
        .map(item => ({
          title: item.title?.trim() || 'Untitled',
          description: (item.contentSnippet || item.description || '').trim(),
          link: getReliableWebsiteUrl(feedUrl, item.link), // Use reliable website URL
          pubDate: item.pubDate,
          formattedDate: formatArticleDate(item.pubDate),
          source: feed.title || feedUrl.replace(/https?:\/\//, '').split('/')[0],
          content: item.content || item.description || '',
          fetchedAt: Date.now(),
          originalLink: item.link, // Keep original for reference
          feedUrl: feedUrl
        }));
      
      newArticles.push(...recentArticles);
      totalFetched += feed.items.length;
      validArticles += recentArticles.length;
      
      // Add delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.warn(`⚠️ Failed to fetch from ${feedUrl}:`, error.message);
    }
  }
  
  console.log(`📊 Scanned ${totalFetched} total articles, found ${validArticles} valid recent articles`);
  
  // Combine with cached articles and remove duplicates
  const allArticles = [...cache.articles, ...newArticles];
  const uniqueArticles = removeDuplicates(allArticles);
  
  // Sort by date (newest first) and ensure they're all recent
  const recentUniqueArticles = uniqueArticles
    .filter(article => isStrictlyRecentArticle(article.pubDate))
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  // Update cache
  cache.articles = recentUniqueArticles;
  cache.lastCleanup = Date.now();
  saveCache(cache);
  
  console.log(`✅ Final count: ${recentUniqueArticles.length} unique recent articles`);
  console.log(`🔗 All articles now link to reliable source websites`);
  
  // Return the most recent articles for processing
  return recentUniqueArticles.slice(0, 30);
}

export async function summarizeWithHuggingFace(text, maxLength = 120) {
  try {
    // Clean and prepare text
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000);
    
    if (cleanText.length < 50) {
      return cleanText + '...';
    }
    
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: cleanText,
        parameters: {
          max_length: maxLength,
          min_length: 40,
          do_sample: false,
          early_stopping: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result[0]?.summary_text) {
      return result[0].summary_text;
    }
    
    // Fallback to truncated original text
    return cleanText.substring(0, maxLength) + '...';
    
  } catch (error) {
    console.warn('⚠️ Summarization failed, using truncated text:', error.message);
    return text.substring(0, maxLength) + '...';
  }
}

export function extractCVEs(text) {
  const cveRegex = /CVE-\d{4}-\d{4,7}/gi;
  const matches = text.match(cveRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

export function classifyThreatSeverity(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  const criticalKeywords = [
    'zero-day', 'zero day', 'critical', 'remote code execution', 'rce', 
    'privilege escalation', 'unauthenticated', 'wormable', 'actively exploited',
    'emergency patch', 'immediate action', 'urgent'
  ];
  
  const highKeywords = [
    'vulnerability', 'exploit', 'breach', 'ransomware', 'malware', 
    'backdoor', 'trojan', 'apt', 'advanced persistent threat', 'attack',
    'compromise', 'infiltration'
  ];
  
  const mediumKeywords = [
    'phishing', 'scam', 'update', 'patch', 'security flaw', 
    'data leak', 'exposure', 'misconfiguration', 'warning'
  ];
  
  if (criticalKeywords.some(keyword => text.includes(keyword))) {
    return 'CRITICAL';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'HIGH';
  } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 'MEDIUM';
  }
  return 'LOW';
}

export function generateContextualBestPractices(threats) {
  // Analyze threats to generate relevant best practices
  const threatTypes = threats.map(t => t.title.toLowerCase() + ' ' + t.description.toLowerCase());
  const allText = threatTypes.join(' ');
  
  const practices = [];
  
  // Add practices based on threat content
  if (allText.includes('phishing') || allText.includes('email')) {
    practices.push('Deploy advanced email security solutions with AI-powered phishing detection and user training programs.');
  }
  
  if (allText.includes('ransomware') || allText.includes('malware')) {
    practices.push('Implement comprehensive backup strategies with offline storage and regular recovery testing procedures.');
  }
  
  if (allText.includes('vulnerability') || allText.includes('patch') || allText.includes('cve')) {
    practices.push('Establish automated vulnerability management with prioritized patching based on threat intelligence.');
  }
  
  if (allText.includes('zero-day') || allText.includes('exploit')) {
    practices.push('Deploy behavioral analysis and endpoint detection response (EDR) solutions for unknown threat detection.');
  }
  
  if (allText.includes('supply chain') || allText.includes('third-party')) {
    practices.push('Implement rigorous third-party risk assessment and supply chain security monitoring protocols.');
  }
  
  // Always include these fundamental practices
  const fundamentalPractices = [
    'Implement zero-trust architecture with continuous verification and least-privilege access controls.',
    'Conduct regular security awareness training with simulated attack scenarios and incident response drills.',
    'Maintain network segmentation with micro-segmentation to limit lateral movement of threats.',
    'Deploy multi-factor authentication across all critical systems and privileged accounts.',
    'Establish continuous monitoring with SIEM/SOAR integration for real-time threat detection and response.'
  ];
  
  // Combine contextual and fundamental practices
  const allPractices = [...practices, ...fundamentalPractices];
  
  // Return top 4 practices
  return allPractices.slice(0, 4).map((practice, index) => ({
    id: (index + 1).toString(),
    content: practice
  }));
}

export function generateContextualTraining(threats) {
  const threatTypes = threats.map(t => t.title.toLowerCase() + ' ' + t.description.toLowerCase());
  const allText = threatTypes.join(' ');
  
  const trainingItems = [];
  
  // Generate training based on current threats
  if (allText.includes('phishing') || allText.includes('social engineering')) {
    trainingItems.push('Advanced phishing simulation exercises with real-world attack scenarios and reporting procedures.');
  }
  
  if (allText.includes('ransomware') || allText.includes('malware')) {
    trainingItems.push('Ransomware response and recovery workshop including backup validation and incident communication.');
  }
  
  if (allText.includes('vulnerability') || allText.includes('patch')) {
    trainingItems.push('Secure development lifecycle training with vulnerability assessment and remediation techniques.');
  }
  
  if (allText.includes('supply chain') || allText.includes('third-party')) {
    trainingItems.push('Third-party risk management and supply chain security assessment methodologies.');
  }
  
  if (allText.includes('zero-day') || allText.includes('exploit')) {
    trainingItems.push('Advanced threat hunting and incident response training for zero-day attack scenarios.');
  }
  
  // Default training items
  const defaultTraining = [
    'Incident response tabletop exercises with cross-functional team coordination and communication protocols.',
    'Cloud security fundamentals workshop covering configuration management and access control best practices.',
    'Mobile device and remote work security training including BYOD policies and secure connectivity.',
    'Security awareness training focused on current threat landscape and attack vectors.'
  ];
  
  const allTraining = [...trainingItems, ...defaultTraining];
  
  return allTraining.slice(0, 3).map((training, index) => ({
    id: (index + 1).toString(),
    content: training
  }));
}

export function generateSecurityThought() {
  const thoughts = [
    'CYBERSECURITY IS NOT ABOUT BUILDING PERFECT WALLS, BUT ABOUT DETECTING AND RESPONDING TO BREACHES FASTER THAN ATTACKERS CAN EXPLOIT THEM.',
    'IN THE DIGITAL BATTLEFIELD, YOUR WEAKEST LINK IS OFTEN YOUR STRONGEST TEACHER - LEARN FROM EVERY INCIDENT.',
    'SECURITY IS A TEAM SPORT: EVERY EMPLOYEE IS A DEFENDER, EVERY PROCESS IS A CONTROL, EVERY DECISION IS A RISK ASSESSMENT.',
    'THE BEST DEFENSE AGAINST TOMORROW\'S THREATS IS TODAY\'S PREPARATION - ASSUME BREACH, PLAN FOR RESILIENCE.',
    'CYBERSECURITY IS NOT A DESTINATION BUT A CONTINUOUS JOURNEY OF ADAPTATION, LEARNING, AND IMPROVEMENT.',
    'IN CYBERSECURITY, PARANOIA IS PROFESSIONALISM - QUESTION EVERYTHING, VERIFY CONSTANTLY, TRUST CAUTIOUSLY.',
    'THE COST OF PREVENTION IS ALWAYS LESS THAN THE PRICE OF RECOVERY - INVEST IN SECURITY BEFORE YOU NEED IT.'
  ];
  
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

export function generateSecurityJoke() {
  const jokes = [
    'WHY DO CYBERSECURITY EXPERTS NEVER GET LOCKED OUT? THEY ALWAYS HAVE A BACKUP PLAN... AND A BACKUP BACKUP PLAN!',
    'WHAT\'S THE DIFFERENCE BETWEEN A SECURITY EXPERT AND A MAGICIAN? THE MAGICIAN MAKES THINGS DISAPPEAR, THE SECURITY EXPERT MAKES THREATS REAPPEAR!',
    'WHY DID THE HACKER BREAK UP WITH THE FIREWALL? BECAUSE THEIR RELATIONSHIP HAD TOO MANY TRUST ISSUES!',
    'HOW MANY CYBERSECURITY PROFESSIONALS DOES IT TAKE TO CHANGE A LIGHT BULB? NONE - THEY JUST DECLARE DARKNESS A SECURITY FEATURE!',
    'WHY DON\'T SECURITY ANALYSTS TRUST STAIRS? BECAUSE THEY\'RE ALWAYS UP TO SOMETHING SUSPICIOUS!',
    'WHAT DO YOU CALL A CYBERSECURITY EXPERT WHO WORKS FROM HOME? A REMOTE ACCESS TROJAN... WAIT, THAT CAME OUT WRONG!',
    'WHY DID THE PASSWORD GO TO THERAPY? IT HAD TOO MANY COMPLEX REQUIREMENTS AND COULDN\'T HANDLE THE PRESSURE!'
  ];
  
  return jokes[Math.floor(Math.random() * jokes.length)];
}