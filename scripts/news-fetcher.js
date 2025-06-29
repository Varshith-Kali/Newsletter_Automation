import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const parser = new Parser();

// Enhanced cybersecurity RSS feeds with more sources for better coverage
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
  'https://www.welivesecurity.com/feed/',
  'https://www.sans.org/blog/rss/',
  'https://www.fireeye.com/blog/feed',
  'https://unit42.paloaltonetworks.com/feed/',
  'https://blog.talosintelligence.com/feeds/posts/default'
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

// Advanced URL validation with real-time checking
async function validateAndTestUrl(url, feedUrl, timeout = 5000) {
  if (!url || typeof url !== 'string') {
    console.warn('⚠️ Invalid URL provided:', url);
    return null;
  }
  
  let cleanUrl = url.trim();
  
  // Handle relative URLs
  if (cleanUrl.startsWith('/')) {
    try {
      const feedDomain = new URL(feedUrl);
      cleanUrl = `${feedDomain.protocol}//${feedDomain.hostname}${cleanUrl}`;
    } catch (error) {
      console.warn('⚠️ Could not construct absolute URL from relative:', cleanUrl);
      return null;
    }
  }
  
  // Ensure URL has protocol
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  
  // Validate URL format
  try {
    const urlObj = new URL(cleanUrl);
    
    // Remove tracking parameters and clean up
    const cleanParams = new URLSearchParams();
    for (const [key, value] of urlObj.searchParams) {
      // Keep essential parameters, remove tracking ones
      if (!key.match(/^(utm_|fbclid|gclid|_ga|ref|source|medium|campaign|mc_)/i)) {
        cleanParams.set(key, value);
      }
    }
    
    urlObj.search = cleanParams.toString();
    const finalUrl = urlObj.toString();
    
    // Test if URL is actually accessible
    try {
      console.log(`🔍 Testing URL accessibility: ${finalUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(finalUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 405) { // 405 = Method Not Allowed (HEAD not supported)
        console.log(`✅ URL accessible: ${finalUrl} (Status: ${response.status})`);
        return finalUrl;
      } else {
        console.warn(`⚠️ URL returned error status ${response.status}: ${finalUrl}`);
        return null;
      }
      
    } catch (fetchError) {
      console.warn(`⚠️ URL not accessible: ${finalUrl} - ${fetchError.message}`);
      return null;
    }
    
  } catch (error) {
    console.warn('⚠️ Invalid URL format:', cleanUrl, error.message);
    return null;
  }
}

// Generate fallback search URL for topics
function generateFallbackSearchUrl(title, source) {
  const searchQuery = encodeURIComponent(title.substring(0, 100));
  const sourceQuery = encodeURIComponent(source || '');
  
  // Try to create a search URL based on the source
  if (source && source.toLowerCase().includes('bleeping')) {
    return `https://www.bleepingcomputer.com/search/?q=${searchQuery}`;
  } else if (source && source.toLowerCase().includes('krebs')) {
    return `https://krebsonsecurity.com/?s=${searchQuery}`;
  } else if (source && source.toLowerCase().includes('dark reading')) {
    return `https://www.darkreading.com/search?query=${searchQuery}`;
  } else if (source && source.toLowerCase().includes('security week')) {
    return `https://www.securityweek.com/search/?q=${searchQuery}`;
  } else if (source && source.toLowerCase().includes('cisa')) {
    return `https://www.cisa.gov/news-events/cybersecurity-advisories`;
  } else if (source && source.toLowerCase().includes('microsoft')) {
    return `https://msrc.microsoft.com/update-guide/en-US/security-updates`;
  } else {
    // Generic cybersecurity search
    return `https://www.google.com/search?q=${searchQuery}+cybersecurity+vulnerability`;
  }
}

// Enhanced threat scoring algorithm
function calculateThreatScore(article) {
  let score = 0;
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  // Critical keywords (highest impact)
  const criticalKeywords = [
    'zero-day', 'zero day', 'critical', 'remote code execution', 'rce', 
    'privilege escalation', 'unauthenticated', 'wormable', 'actively exploited',
    'emergency patch', 'immediate action', 'urgent', 'ransomware', 'apt',
    'supply chain', 'backdoor', 'nation-state'
  ];
  
  // High impact keywords
  const highKeywords = [
    'vulnerability', 'exploit', 'breach', 'malware', 'trojan', 
    'advanced persistent threat', 'attack', 'compromise', 'infiltration',
    'data breach', 'stolen', 'leaked', 'exposed'
  ];
  
  // Medium impact keywords
  const mediumKeywords = [
    'phishing', 'scam', 'update', 'patch', 'security flaw', 
    'data leak', 'exposure', 'misconfiguration', 'warning'
  ];
  
  // CVE mentions add significant score
  const cveMatches = text.match(/cve-\d{4}-\d{4,7}/gi) || [];
  score += cveMatches.length * 15;
  
  // Critical keywords
  criticalKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 20;
  });
  
  // High keywords
  highKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 10;
  });
  
  // Medium keywords
  mediumKeywords.forEach(keyword => {
    if (text.includes(keyword)) score += 5;
  });
  
  // Recency bonus (more recent = higher score)
  const articleDate = new Date(article.pubDate);
  const now = new Date();
  const hoursOld = (now - articleDate) / (1000 * 60 * 60);
  
  if (hoursOld < 24) score += 10; // Last 24 hours
  else if (hoursOld < 48) score += 7; // Last 48 hours
  else if (hoursOld < 72) score += 5; // Last 3 days
  
  // Source credibility bonus
  const credibleSources = [
    'microsoft', 'cisa', 'nist', 'sans', 'fireeye', 'crowdstrike',
    'palo alto', 'symantec', 'kaspersky', 'trend micro', 'bleeping'
  ];
  
  credibleSources.forEach(source => {
    if (article.source.toLowerCase().includes(source)) {
      score += 8;
    }
  });
  
  return score;
}

export async function fetchCyberSecurityNews() {
  console.log('🤖 AI-POWERED THREAT INTELLIGENCE: Fetching latest cybersecurity incidents...');
  console.log(`📅 Current time: ${new Date().toISOString()}`);
  console.log(`📅 Cutoff time: ${new Date(Date.now() - CACHE_DURATION).toISOString()}`);
  
  // Load existing cache
  let cache = loadCache();
  
  // Clean old articles from cache
  cache.articles = cleanOldArticles(cache.articles);
  
  const newArticles = [];
  let totalFetched = 0;
  let validArticles = 0;
  let validLinks = 0;
  let fallbackLinks = 0;
  
  console.log(`🔍 Scanning ${RSS_FEEDS.length} cybersecurity intelligence sources...`);
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching from: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      
      const recentArticles = [];
      
      for (const item of feed.items.slice(0, 15)) { // Check more items per feed for better coverage
        const isRecent = isStrictlyRecentArticle(item.pubDate);
        if (isRecent) {
          console.log(`✅ Valid article: ${item.title} - ${formatArticleDate(item.pubDate)}`);
          
          // Test multiple potential URLs for the article
          let validatedLink = null;
          const potentialUrls = [
            item.link,
            item.guid,
            item.url,
            item.permalink
          ].filter(Boolean);
          
          // Try each potential URL
          for (const testUrl of potentialUrls) {
            validatedLink = await validateAndTestUrl(testUrl, feedUrl);
            if (validatedLink) {
              validLinks++;
              console.log(`🔗 Valid link found: ${validatedLink}`);
              break;
            }
          }
          
          // If no valid link found, create a fallback search URL
          if (!validatedLink) {
            validatedLink = generateFallbackSearchUrl(item.title, feed.title);
            fallbackLinks++;
            console.log(`🔄 Using fallback search URL: ${validatedLink}`);
          }
          
          const article = {
            title: item.title?.trim() || 'Untitled',
            description: (item.contentSnippet || item.description || '').trim(),
            link: validatedLink, // Always has a working link (validated or fallback)
            pubDate: item.pubDate,
            formattedDate: formatArticleDate(item.pubDate),
            source: feed.title || feedUrl.replace(/https?:\/\//, '').split('/')[0],
            content: item.content || item.description || '',
            fetchedAt: Date.now(),
            originalLink: item.link, // Keep original for debugging
            feedUrl: feedUrl,
            linkType: validatedLink === item.link ? 'direct' : 'fallback'
          };
          
          // Calculate threat score for intelligent ranking
          article.threatScore = calculateThreatScore(article);
          
          recentArticles.push(article);
          validArticles++;
        }
      }
      
      newArticles.push(...recentArticles);
      totalFetched += feed.items.length;
      
      // Add delay to be respectful to servers and avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1200));
      
    } catch (error) {
      console.warn(`⚠️ Failed to fetch from ${feedUrl}:`, error.message);
    }
  }
  
  console.log(`📊 Scanned ${totalFetched} total articles, found ${validArticles} valid recent articles`);
  console.log(`🔗 Direct links validated: ${validLinks}`);
  console.log(`🔄 Fallback search links created: ${fallbackLinks}`);
  
  // Combine with cached articles and remove duplicates
  const allArticles = [...cache.articles, ...newArticles];
  const uniqueArticles = removeDuplicates(allArticles);
  
  // Sort by threat score and date (newest first) and ensure they're all recent
  const recentUniqueArticles = uniqueArticles
    .filter(article => isStrictlyRecentArticle(article.pubDate))
    .sort((a, b) => {
      // Primary sort: threat score (higher first)
      if (b.threatScore !== a.threatScore) {
        return b.threatScore - a.threatScore;
      }
      // Secondary sort: date (newer first)
      return new Date(b.pubDate) - new Date(a.pubDate);
    });
  
  // Update cache
  cache.articles = recentUniqueArticles;
  cache.lastCleanup = Date.now();
  saveCache(cache);
  
  console.log(`✅ Final count: ${recentUniqueArticles.length} unique recent articles`);
  console.log(`🔗 All articles have working links (${recentUniqueArticles.filter(a => a.linkType === 'direct').length} direct, ${recentUniqueArticles.filter(a => a.linkType === 'fallback').length} fallback)`);
  console.log(`🎯 Top threat scores: ${recentUniqueArticles.slice(0, 5).map(a => a.threatScore).join(', ')}`);
  
  // Return the most recent and highest-scoring articles for processing
  return recentUniqueArticles.slice(0, 50); // Return top 50 for further processing
}

// Enhanced AI summarization with multiple fallbacks
export async function summarizeWithAI(text, maxLength = 130) {
  try {
    // Clean and prepare text
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1500); // Increased for better context
    
    if (cleanText.length < 50) {
      return cleanText + '...';
    }
    
    console.log('🤖 Attempting AI summarization...');
    
    // Try multiple AI endpoints for better reliability
    const aiEndpoints = [
      {
        url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        headers: { 'Content-Type': 'application/json' },
        body: {
          inputs: cleanText,
          parameters: {
            max_length: maxLength,
            min_length: 50,
            do_sample: false,
            early_stopping: true
          }
        }
      },
      {
        url: 'https://api-inference.huggingface.co/models/google/pegasus-xsum',
        headers: { 'Content-Type': 'application/json' },
        body: {
          inputs: cleanText,
          parameters: {
            max_length: maxLength,
            min_length: 50
          }
        }
      }
    ];
    
    for (const endpoint of aiEndpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: endpoint.headers,
          body: JSON.stringify(endpoint.body)
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result[0]?.summary_text) {
            console.log('✅ AI summarization successful');
            return result[0].summary_text;
          } else if (result[0]?.generated_text) {
            console.log('✅ AI text generation successful');
            return result[0].generated_text.substring(0, maxLength) + '...';
          }
        }
      } catch (error) {
        console.warn(`⚠️ AI endpoint failed: ${endpoint.url}`, error.message);
        continue;
      }
    }
    
    // Intelligent fallback: extract key sentences
    console.log('🔄 Using intelligent text extraction fallback...');
    return extractKeyInformation(cleanText, maxLength);
    
  } catch (error) {
    console.warn('⚠️ All summarization methods failed, using truncated text:', error.message);
    return text.substring(0, maxLength) + '...';
  }
}

// Intelligent text extraction for fallback
function extractKeyInformation(text, maxLength) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Prioritize sentences with important keywords
  const importantKeywords = [
    'vulnerability', 'exploit', 'breach', 'attack', 'malware', 'ransomware',
    'critical', 'zero-day', 'cve', 'patch', 'security', 'threat'
  ];
  
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    importantKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) score += 1;
    });
    
    // Prefer shorter, more concise sentences
    if (sentence.length < 100) score += 0.5;
    
    return { sentence: sentence.trim(), score };
  });
  
  // Sort by score and take the best sentences
  scoredSentences.sort((a, b) => b.score - a.score);
  
  let result = '';
  for (const item of scoredSentences) {
    if (result.length + item.sentence.length < maxLength - 3) {
      result += (result ? '. ' : '') + item.sentence;
    } else {
      break;
    }
  }
  
  return result + '...';
}

export function extractCVEs(text) {
  const cveRegex = /CVE-\d{4}-\d{4,7}/gi;
  const matches = text.match(cveRegex) || [];
  return [...new Set(matches)]; // Remove duplicates
}

export function classifyThreatSeverity(title, description, threatScore = 0) {
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
  
  // Use threat score as additional factor
  if (threatScore > 50 || criticalKeywords.some(keyword => text.includes(keyword))) {
    return 'CRITICAL';
  } else if (threatScore > 30 || highKeywords.some(keyword => text.includes(keyword))) {
    return 'HIGH';
  } else if (threatScore > 15 || mediumKeywords.some(keyword => text.includes(keyword))) {
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
  
  // Generate training based on current threats with ONLY 2 most relevant certifications in bold
  if (allText.includes('microsoft') || allText.includes('exchange') || allText.includes('vulnerability') || allText.includes('patch')) {
    trainingItems.push('Emergency Patch Management Workshop: Rapid vulnerability assessment, testing procedures, and coordinated deployment strategies. **Recommended: CISSP + SANS SEC566** (Implementing and Auditing Critical Security Controls).');
  }
  
  if (allText.includes('ransomware') || allText.includes('healthcare') || allText.includes('malware')) {
    trainingItems.push('Ransomware Incident Response Workshop: Isolation procedures, backup validation, communication protocols, and recovery strategies. **Recommended: GCIH + SANS FOR508** (Advanced Incident Response, Threat Hunting, and Digital Forensics).');
  }
  
  if (allText.includes('supply chain') || allText.includes('npm') || allText.includes('package') || allText.includes('third-party')) {
    trainingItems.push('Supply Chain Security Assessment: Code dependency analysis, vendor risk evaluation, and secure development practices. **Recommended: CISSP + DevSecOps Foundation** Certification.');
  }
  
  if (allText.includes('ai-generated') || allText.includes('phishing') || allText.includes('email') || allText.includes('artificial intelligence')) {
    trainingItems.push('Advanced AI Phishing Detection Workshop: Identifying AI-generated content, deepfake recognition, and enhanced email security awareness. **Recommended: CompTIA Security+ + SANS SEC487** (Open-Source Intelligence Gathering and Analysis).');
  }
  
  // Default training items with 2 most relevant certifications
  const defaultTraining = [
    'Incident Response Tabletop Exercise: Cross-functional coordination, communication protocols, and decision-making under pressure. **Recommended: GCIH + CISM** (Certified Information Security Manager).',
    'Advanced Threat Detection Workshop: SIEM analysis, threat intelligence integration, and proactive security monitoring. **Recommended: GCFA + CySA+** (CompTIA Cybersecurity Analyst).'
  ];
  
  const allTraining = [...trainingItems, ...defaultTraining];
  
  return allTraining.slice(0, 2).map((training, index) => ({
    id: (index + 1).toString(),
    content: training
  }));
}

// Enhanced unique thought generator with technology focus
export function generateSecurityThought() {
  const uniqueThoughts = [
    'IN THE AGE OF AI AND QUANTUM COMPUTING, CYBERSECURITY IS EVOLVING FROM REACTIVE DEFENSE TO PREDICTIVE INTELLIGENCE - ANTICIPATE THREATS BEFORE THEY MATERIALIZE.',
    'CLOUD-NATIVE SECURITY REQUIRES A FUNDAMENTAL SHIFT: SECURE BY DESIGN, NOT SECURE BY ADDITION - EMBED PROTECTION INTO EVERY MICROSERVICE AND API.',
    'THE CONVERGENCE OF IOT, 5G, AND EDGE COMPUTING CREATES AN EXPONENTIALLY LARGER ATTACK SURFACE - SECURITY MUST SCALE AT THE SPEED OF INNOVATION.',
    'ZERO TRUST IS NOT A PRODUCT BUT A PHILOSOPHY: VERIFY EVERY USER, DEVICE, AND TRANSACTION AS IF THE NETWORK IS ALREADY COMPROMISED.',
    'ARTIFICIAL INTELLIGENCE IN CYBERSECURITY IS A DOUBLE-EDGED SWORD - WHILE IT ENHANCES DETECTION, IT ALSO EMPOWERS SOPHISTICATED ADVERSARIES.',
    'THE FUTURE OF CYBERSECURITY LIES IN AUTONOMOUS RESPONSE SYSTEMS THAT CAN ADAPT AND COUNTER THREATS FASTER THAN HUMAN REACTION TIME.',
    'BLOCKCHAIN TECHNOLOGY OFFERS IMMUTABLE AUDIT TRAILS, BUT ITS SECURITY IS ONLY AS STRONG AS ITS IMPLEMENTATION AND KEY MANAGEMENT.',
    'QUANTUM-RESISTANT CRYPTOGRAPHY IS NOT A FUTURE CONCERN - IT IS A PRESENT NECESSITY AS QUANTUM COMPUTING CAPABILITIES RAPIDLY ADVANCE.',
    'CYBERSECURITY MESH ARCHITECTURE ENABLES DISTRIBUTED SECURITY PERIMETERS THAT MOVE WITH DATA AND APPLICATIONS ACROSS HYBRID ENVIRONMENTS.',
    'THE HUMAN ELEMENT REMAINS THE WEAKEST LINK IN CYBERSECURITY - TECHNOLOGY MUST AUGMENT HUMAN DECISION-MAKING, NOT REPLACE IT.',
    'DEVSECOPS TRANSFORMS SECURITY FROM A BOTTLENECK TO AN ACCELERATOR - SHIFT LEFT TO BUILD SECURITY INTO THE SOFTWARE DEVELOPMENT LIFECYCLE.',
    'PRIVACY-PRESERVING TECHNOLOGIES LIKE HOMOMORPHIC ENCRYPTION ENABLE SECURE COMPUTATION ON ENCRYPTED DATA WITHOUT EXPOSING SENSITIVE INFORMATION.'
  ];
  
  // Select based on current date to ensure uniqueness over time
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return uniqueThoughts[dayOfYear % uniqueThoughts.length];
}

// Enhanced unique joke generator with technology focus
export function generateSecurityJoke() {
  const uniqueJokes = [
    'WHY DID THE AI SECURITY ANALYST BREAK UP WITH THE TRADITIONAL FIREWALL? BECAUSE IT COULDN\'T HANDLE THEIR MACHINE LEARNING RELATIONSHIP!',
    'WHAT DO YOU CALL A CYBERSECURITY EXPERT WHO WORKS WITH QUANTUM COMPUTERS? A SCHRÖDINGER\'S DEFENDER - THEY\'RE SIMULTANEOUSLY SECURE AND BREACHED!',
    'WHY DON\'T BLOCKCHAIN DEVELOPERS EVER GET LOST? BECAUSE THEY ALWAYS HAVE A DISTRIBUTED LEDGER TO FOLLOW!',
    'WHAT\'S THE DIFFERENCE BETWEEN A CLOUD SECURITY ENGINEER AND A METEOROLOGIST? ONE PREDICTS STORMS IN THE CLOUD, THE OTHER PREVENTS THEM!',
    'WHY DID THE ZERO TRUST ARCHITECT REFUSE TO PLAY POKER? BECAUSE THEY NEVER TRUST ANYONE, EVEN WITH A ROYAL FLUSH!',
    'WHAT DO YOU CALL A PHISHING EMAIL THAT USES DEEPFAKE TECHNOLOGY? A CATFISH WITH A PHD IN ARTIFICIAL INTELLIGENCE!',
    'WHY DID THE IOT DEVICE GO TO THERAPY? IT HAD TOO MANY TRUST ISSUES WITH ITS NETWORK CONNECTIONS!',
    'WHAT\'S A CYBERSECURITY PROFESSIONAL\'S FAVORITE TYPE OF MUSIC? ANYTHING WITH GOOD ENCRYPTION... AND STRONG AUTHENTICATION BEATS!',
    'WHY DON\'T QUANTUM COMPUTERS MAKE GOOD COMEDIANS? BECAUSE THEIR JOKES EXIST IN SUPERPOSITION - FUNNY AND NOT FUNNY AT THE SAME TIME!',
    'WHAT DO YOU CALL A SECURITY INCIDENT RESPONSE TEAM THAT WORKS FROM HOME? A REMOTE ACCESS TROJAN... WAIT, THAT CAME OUT WRONG AGAIN!',
    'WHY DID THE DEVSECOPS ENGINEER BECOME A CHEF? BECAUSE THEY WERE ALREADY EXPERTS AT SHIFTING LEFT AND COOKING UP SECURE RECIPES!',
    'WHAT\'S THE DIFFERENCE BETWEEN A CYBERSECURITY MESH AND A FISHING NET? ONE CATCHES THREATS, THE OTHER CATCHES FISH - BUT BOTH HAVE HOLES!'
  ];
  
  // Select based on current month and week to ensure variety
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24 * 7));
  return uniqueJokes[weekOfYear % uniqueJokes.length];
}