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

  const handleThreatClick = (threat: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🔗 Threat title clicked:', {
      title: threat.title,
      link: threat.link,
      linkType: threat.linkType,
      source: threat.source
    });
    
    if (threat.link && threat.link.trim() !== '') {
      try {
        // Validate URL format
        new URL(threat.link);
        
        console.log(`✅ Opening ${threat.linkType === 'fallback' ? 'search results for' : 'article'}: ${threat.link}`);
        
        // Show user what type of link they're opening
        if (threat.linkType === 'fallback') {
          console.log('🔄 Note: Opening search results as original article link was not accessible');
        }
        
        window.open(threat.link, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('❌ Invalid URL format:', threat.link, error);
        alert(`Invalid URL format: ${threat.link}`);
      }
    } else {
      console.warn('⚠️ No valid link available for this threat');
      alert('No source link available for this incident');
    }
  };

  const getLinkTypeTooltip = (linkType?: string, source?: string) => {
    if (linkType === 'fallback') {
      return `Click to search for this article on ${source || 'the web'}`;
    }
    return 'Click to read the full article';
  };

  const shortenUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname.substring(0, 25) + '...' : '');
    } catch {
      return url.substring(0, 40) + '...';
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
                    className={`text-black transition-all duration-200 ${
                      threat.link && threat.link.trim() !== ''
                        ? 'cursor-pointer hover:text-red-600 hover:underline hover:scale-[1.02] transform' 
                        : 'cursor-default'
                    }`}
                    title={getLinkTypeTooltip(threat.linkType, threat.source)}
                  >
                    {index + 1}. {threat.title}
                  </span>
                  {getSeverityBadge(threat.severity)}
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-2">{threat.description}</p>
              
              {/* VISIBLE LINK FOR DOWNLOADS - Only shows in downloaded versions */}
              {threat.link && threat.link.trim() !== '' && (
                <div className="mt-2 mb-2 print-link-visible download-link-visible">
                  <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-blue-700">
                        {threat.linkType === 'fallback' ? '🔍 Search:' : '🔗 Source:'}
                      </span>
                      <span className="text-xs text-blue-600 font-mono break-all">
                        {threat.link}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {threat.source && (
                    <span className="italic">Source: {threat.source}</span>
                  )}
                  <span className="text-gray-600 font-medium">
                    {formatDate(threat.formattedDate, threat.pubDate)}
                  </span>
                  {threat.linkType === 'fallback' && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      Search Link
                    </span>
                  )}
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
      </div>
    </div>
  );
};

export default NewsletterThreats;