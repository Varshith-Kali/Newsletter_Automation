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

  return (
    <div className="newsletter-page newsletter-threats">
      <div className="min-h-screen bg-white text-black flex">
        {/* Left red sidebar with images */}
        <div className="w-5/12 bg-red-700 relative">
          <div className="h-1/3 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Cybersecurity" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="h-1/3 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Hacker" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="h-1/3 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Security" 
              className="w-full h-full object-cover grayscale"
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
                    {threat.link ? (
                      <a 
                        href={threat.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 underline hover:no-underline transition-colors cursor-pointer"
                      >
                        {index + 1}. {threat.title}
                      </a>
                    ) : (
                      <span className="cursor-pointer text-blue-700 hover:text-blue-900 underline hover:no-underline transition-colors">
                        {index + 1}. {threat.title}
                      </span>
                    )}
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
                    <span className="text-gray-600">
                      {formatDate(threat.formattedDate, threat.pubDate)}
                    </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterThreats;