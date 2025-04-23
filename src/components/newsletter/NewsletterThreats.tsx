import React from 'react';
import { useNewsletter } from '../../context/NewsletterContext';

const NewsletterThreats: React.FC = () => {
  const { threats } = useNewsletter();

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
                <h3 className="font-bold mb-2">
                  {index + 1}. {threat.title}
                </h3>
                <p className="text-sm leading-relaxed">{threat.description}</p>
              </div>
            ))}
          </div>
          
          {threats.length > 4 && (
            <div className="mt-8 bg-gray-100 p-4 font-bold uppercase">
              INDUSTRIAL SYSTEMS VULNERABLE TO UNAUTHENTICATED COMMAND EXECUTION. ISOLATE OT NETWORKS AND APPLY VENDOR PATCHES.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterThreats;