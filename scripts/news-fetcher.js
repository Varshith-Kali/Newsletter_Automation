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
  'https://www.recordedfuture.com/feed'
];

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

// Check if article is from the last 7 days
function isRecentArticle(pubDate) {
  const articleDate = new Date(pubDate);
  const sevenDaysAgo = new Date(Date.now() - CACHE_DURATION);
  return articleDate > sevenDaysAgo;
}

export async function fetchCyberSecurityNews() {
  console.log('🔍 Fetching latest cybersecurity news from past 7 days...');
  
  // Load existing cache
  let cache = loadCache();
  
  // Clean old articles from cache
  cache.articles = cleanOldArticles(cache.articles);
  
  const newArticles = [];
  let totalFetched = 0;
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching from: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      const recentArticles = feed.items
        .filter(item => isRecentArticle(item.pubDate))
        .slice(0, 10) // Limit per feed to avoid overwhelming
        .map(item => ({
          title: item.title?.trim() || 'Untitled',
          description: (item.contentSnippet || item.description || '').trim(),
          link: item.link,
          pubDate: item.pubDate,
          source: feed.title || feedUrl.replace(/https?:\/\//, '').split('/')[0],
          content: item.content || item.description || '',
          fetchedAt: Date.now()
        }));
      
      newArticles.push(...recentArticles);
      totalFetched += recentArticles.length;
      
      // Add delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.warn(`⚠️ Failed to fetch from ${feedUrl}:`, error.message);
    }
  }
  
  console.log(`📊 Fetched ${totalFetched} new articles from ${RSS_FEEDS.length} sources`);
  
  // Combine with cached articles and remove duplicates
  const allArticles = [...cache.articles, ...newArticles];
  const uniqueArticles = removeDuplicates(allArticles);
  
  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  // Update cache
  cache.articles = uniqueArticles;
  cache.lastCleanup = Date.now();
  saveCache(cache);
  
  console.log(`✅ Total unique articles: ${uniqueArticles.length}`);
  
  // Return the most recent articles for processing
  return uniqueArticles.slice(0, 25);
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
    'privilege escalation', 'unauthenticated', 'wormable', 'actively exploited'
  ];
  
  const highKeywords = [
    'vulnerability', 'exploit', 'breach', 'ransomware', 'malware', 
    'backdoor', 'trojan', 'apt', 'advanced persistent threat'
  ];
  
  const mediumKeywords = [
    'phishing', 'scam', 'update', 'patch', 'security flaw', 
    'data leak', 'exposure', 'misconfiguration'
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
  
  // Default training items
  const defaultTraining = [
    'Incident response tabletop exercises with cross-functional team coordination and communication protocols.',
    'Cloud security fundamentals workshop covering configuration management and access control best practices.',
    'Mobile device and remote work security training including BYOD policies and secure connectivity.'
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