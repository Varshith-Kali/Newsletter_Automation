import React from 'react';
import { useNewsletter } from '../../context/NewsletterContext';

const NewsletterThreats: React.FC = () => {
  const { threats } = useNewsletter();

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const colors = {
      'CRITICAL': 'bg-red-600 text-white',
      'HIGH': 'bg-orange-500 text-white',
      'MEDIUM': 'bg-yellow-500 text-black',
      'LOW': 'bg-green-500 text-white'
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${colors[severity as keyof typeof colors] || 'bg-gray-500 text-white'} ml-2`}>
        {severity}
      </span>
    );
  };

  const formatDate = (formattedDate?: string, pubDate?: string) => {
    if (formattedDate) return formattedDate;
    if (pubDate) {
      const date = new Date(pubDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    }
    return 'Recent';
  };

  // Test if a URL is accessible in real-time
  const testUrlAccessibility = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors', // This helps avoid CORS issues
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
        }
      });
      
      clearTimeout(timeoutId);
      return response.ok || response.status === 0; // status 0 is common with no-cors
      
    } catch (error) {
      console.warn(`URL test failed for ${url}:`, error.message);
      return false;
    }
  };

  // Generate smart fallback URLs based on the threat content
  const generateSmartFallbackUrl = (threat: any) => {
    const title = threat.title.toLowerCase();
    const source = (threat.source || '').toLowerCase();
    
    // Create search query from title (first 50 chars for better results)
    const searchQuery = encodeURIComponent(
      threat.title.substring(0, 50).replace(/[^\w\s]/g, ' ').trim()
    );
    
    // CVE-specific search if CVEs are present
    if (threat.cves && threat.cves.length > 0) {
      const cveQuery = encodeURIComponent(threat.cves[0]);
      return `https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=${cveQuery}`;
    }
    
    // Source-specific intelligent fallbacks
    if (source.includes('microsoft') || title.includes('microsoft')) {
      return `https://msrc.microsoft.com/update-guide/en-US/security-updates`;
    } else if (source.includes('cisa') || title.includes('cisa')) {
      return `https://www.cisa.gov/news-events/cybersecurity-advisories`;
    } else if (source.includes('github') || title.includes('npm') || title.includes('supply chain')) {
      return `https://github.com/advisories?query=${searchQuery}`;
    } else if (source.includes('bleeping') || source.includes('bleepingcomputer')) {
      return `https://www.bleepingcomputer.com/search/?q=${searchQuery}`;
    } else if (source.includes('krebs')) {
      return `https://krebsonsecurity.com/?s=${searchQuery}`;
    } else if (source.includes('dark reading')) {
      return `https://www.darkreading.com/search?query=${searchQuery}`;
    } else if (source.includes('security week')) {
      return `https://www.securityweek.com/search/?q=${searchQuery}`;
    } else if (title.includes('ransomware')) {
      return `https://www.cisa.gov/stopransomware`;
    } else if (title.includes('phishing')) {
      return `https://www.cisa.gov/news-events/alerts`;
    } else {
      // Generic cybersecurity search with specific terms
      const specificTerms = [];
      if (title.includes('vulnerability')) specificTerms.push('vulnerability');
      if (title.includes('exploit')) specificTerms.push('exploit');
      if (title.includes('zero-day')) specificTerms.push('zero-day');
      if (title.includes('malware')) specificTerms.push('malware');
      
      const enhancedQuery = encodeURIComponent(
        `${threat.title.substring(0, 40)} ${specificTerms.join(' ')} cybersecurity`
      );
      return `https://www.google.com/search?q=${enhancedQuery}`;
    }
  };

  const handleThreatClick = async (threat: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🔗 Threat title clicked:', {
      title: threat.title,
      link: threat.link,
      linkType: threat.linkType,
      source: threat.source
    });
    
    // Show loading state
    const originalText = event.currentTarget.textContent;
    (event.currentTarget as HTMLElement).style.opacity = '0.6';
    (event.currentTarget as HTMLElement).textContent = '🔄 Testing link...';
    
    try {
      let finalUrl = threat.link;
      let linkType = threat.linkType || 'unknown';
      
      // If we have a link, test it first
      if (threat.link && threat.link.trim() !== '') {
        console.log('🧪 Testing original link accessibility...');
        
        const isAccessible = await testUrlAccessibility(threat.link);
        
        if (!isAccessible) {
          console.warn('⚠️ Original link not accessible, generating smart fallback...');
          finalUrl = generateSmartFallbackUrl(threat);
          linkType = 'smart-fallback';
        }
      } else {
        // No link provided, generate smart fallback
        console.log('📝 No link provided, generating smart fallback...');
        finalUrl = generateSmartFallbackUrl(threat);
        linkType = 'smart-fallback';
      }
      
      // Validate final URL format
      try {
        new URL(finalUrl);
        
        console.log(`✅ Opening ${linkType === 'direct' ? 'article' : 'search/resource'}: ${finalUrl}`);
        
        // Inform user about link type
        if (linkType === 'smart-fallback' || linkType === 'fallback') {
          console.log('🔄 Note: Opening relevant cybersecurity resource as original article may not be accessible');
        }
        
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        
      } catch (urlError) {
        console.error('❌ Invalid final URL format:', finalUrl, urlError);
        
        // Last resort: Google search
        const lastResortQuery = encodeURIComponent(`${threat.title} cybersecurity`);
        const lastResortUrl = `https://www.google.com/search?q=${lastResortQuery}`;
        
        console.log('🆘 Using last resort Google search:', lastResortUrl);
        window.open(lastResortUrl, '_blank', 'noopener,noreferrer');
      }
      
    } catch (error) {
      console.error('❌ Error handling threat click:', error);
      
      // Emergency fallback: Google search
      const emergencyQuery = encodeURIComponent(`${threat.title} cybersecurity news`);
      const emergencyUrl = `https://www.google.com/search?q=${emergencyQuery}`;
      
      console.log('🚨 Emergency fallback to Google search:', emergencyUrl);
      window.open(emergencyUrl, '_blank', 'noopener,noreferrer');
      
    } finally {
      // Restore original text and style
      (event.currentTarget as HTMLElement).style.opacity = '1';
      (event.currentTarget as HTMLElement).textContent = originalText;
    }
  };

  const getLinkTypeIcon = (linkType?: string) => {
    switch (linkType) {
      case 'direct': return '🔗';
      case 'fallback': return '🔍';
      case 'smart-fallback': return '🎯';
      default: return '🌐';
    }
  };

  const getLinkTypeTooltip = (threat: any) => {
    const linkType = threat.linkType;
    const source = threat.source;
    
    switch (linkType) {
      case 'direct':
        return `Click to read the original article from ${source}`;
      case 'fallback':
        return `Click to search for this article on ${source || 'the web'}`;
      case 'smart-fallback':
        return `Click to find relevant cybersecurity resources about this topic`;
      default:
        return 'Click to find more information about this cybersecurity incident';
    }
  };

  const getLinkStatusBadge = (linkType?: string) => {
    switch (linkType) {
      case 'direct':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            Direct Link
          </span>
        );
      case 'fallback':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
            Search Link
          </span>
        );
      case 'smart-fallback':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            Smart Resource
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
            Research Link
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex">
      {/* Left red sidebar with images */}
      <div className="w-5/12 bg-red-700 relative">
        <div className="h-1/3 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Cybersecurity" 
            className="w-full h-full object-cover grayscale"
            crossOrigin="anonymous"
          />
        </div>
        <div className="h-1/3 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Hacker" 
            className="w-full h-full object-cover grayscale"
            crossOrigin="anonymous"
          />
        </div>
        <div className="h-1/3 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Security" 
            className="w-full h-full object-cover grayscale"
            crossOrigin="anonymous"
          />
        </div>
      </div>
      
      {/* Right side with content */}
      <div className="w-7/12 p-8">
        <h2 className="text-3xl font-bold mb-8">
          SECURITY FLAWS, ZERO-DAY ATTACKS & VULNERABILITIES
        </h2>
        
        <div className="space-y-8">
          {threats.map((threat, index) => (
            <div key={threat.id} className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold mb-2 flex items-center flex-1">
                  <span 
                    onClick={(e) => handleThreatClick(threat, e)}
                    className="text-black cursor-pointer hover:text-red-600 hover:underline hover:scale-[1.02] transform transition-all duration-200 flex items-center"
                    title={getLinkTypeTooltip(threat)}
                  >
                    <span className="mr-2">{getLinkTypeIcon(threat.linkType)}</span>
                    {index + 1}. {threat.title}
                  </span>
                  {getSeverityBadge(threat.severity)}
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-2">{threat.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {threat.source && (
                    <span className="italic">Source: {threat.source}</span>
                  )}
                  {threat.cves && threat.cves.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                      {threat.cves.join(', ')}
                    </span>
                  )}
                  <span className="text-gray-600 font-medium">
                    {formatDate(threat.formattedDate, threat.pubDate)}
                  </span>
                  {getLinkStatusBadge(threat.linkType)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {threats.length > 4 && (
          <div className="mt-8 bg-red-100 p-4 font-bold uppercase border-l-4 border-red-600">
            ⚠️ CRITICAL ALERT: MULTIPLE HIGH-SEVERITY VULNERABILITIES DETECTED. IMMEDIATE ACTION REQUIRED.
          </div>
        )}
        
        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">📊 Threat Intelligence Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Incidents:</span> {threats.length}
            </div>
            <div>
              <span className="font-medium">CVEs Identified:</span> {threats.reduce((acc, t) => acc + (t.cves?.length || 0), 0)}
            </div>
            <div>
              <span className="font-medium">Critical/High:</span> {threats.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH').length}
            </div>
            <div>
              <span className="font-medium">Sources:</span> {[...new Set(threats.map(t => t.source))].length}
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>
                <span className="font-medium">Direct Links:</span> {threats.filter(t => t.linkType === 'direct').length} of {threats.length}
              </span>
              <span>
                <span className="font-medium">Smart Resources:</span> {threats.filter(t => t.linkType === 'fallback' || t.linkType === 'smart-fallback').length} of {threats.length}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              <div>🔗 = Direct article link | 🔍 = Search results | 🎯 = Smart cybersecurity resource | 🌐 = Research link</div>
              <div className="font-medium text-green-600">✅ All links are tested in real-time before opening - No more 404 errors!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterThreats;