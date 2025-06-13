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
                <h3 className="font-bold mb-2 flex items-center">
                  {index + 1}. {threat.title}
                  {getSeverityBadge(threat.severity)}
                </h3>
                <p className="text-sm leading-relaxed">{threat.description}</p>
                {threat.source && (
                  <p className="text-xs text-gray-500 mt-1 italic">Source: {threat.source}</p>
                )}
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
    </div>
  );
};

export default NewsletterThreats;