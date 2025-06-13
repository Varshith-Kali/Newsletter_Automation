import { 
  fetchCyberSecurityNews, 
  summarizeWithHuggingFace, 
  extractCVEs, 
  classifyThreatSeverity,
  generateBestPractices,
  generateTrainingItems,
  generateSecurityThought,
  generateSecurityJoke
} from './news-fetcher.js';
import { writeFileSync } from 'fs';

async function updateNewsletterContent() {
  console.log('🚀 Starting automated newsletter content generation...');
  
  try {
    // Fetch latest cybersecurity news
    const articles = await fetchCyberSecurityNews();
    
    if (articles.length === 0) {
      console.log('❌ No articles fetched. Using fallback content.');
      return;
    }
    
    console.log('🤖 Processing articles with AI...');
    
    // Process articles into threats
    const threats = [];
    let processedCount = 0;
    
    for (const article of articles.slice(0, 6)) {
      try {
        console.log(`📝 Processing: ${article.title.substring(0, 50)}...`);
        
        const summary = await summarizeWithHuggingFace(
          article.description || article.content, 
          120
        );
        
        const cves = extractCVEs(article.title + ' ' + article.description);
        const severity = classifyThreatSeverity(article.title, article.description);
        
        let title = article.title;
        if (cves.length > 0) {
          title += ` (${cves[0]})`;
        }
        
        threats.push({
          id: (processedCount + 1).toString(),
          title: title,
          description: summary,
          severity: severity,
          source: article.source
        });
        
        processedCount++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.warn(`⚠️ Failed to process article: ${error.message}`);
      }
    }
    
    console.log(`✅ Processed ${threats.length} threats`);
    
    // Generate other content
    const bestPractices = generateBestPractices(threats);
    const trainingItems = generateTrainingItems(threats);
    const thoughtOfTheDay = generateSecurityThought();
    const securityJoke = generateSecurityJoke();
    
    // Create newsletter data
    const newsletterData = {
      threats,
      bestPractices,
      trainingItems,
      thoughtOfTheDay,
      securityJoke,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to JSON file
    writeFileSync('src/data/newsletter-content.json', JSON.stringify(newsletterData, null, 2));
    
    console.log('🎉 Newsletter content updated successfully!');
    console.log(`📊 Generated: ${threats.length} threats, ${bestPractices.length} best practices, ${trainingItems.length} training items`);
    
  } catch (error) {
    console.error('❌ Error updating newsletter content:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateNewsletterContent();
}

export { updateNewsletterContent };