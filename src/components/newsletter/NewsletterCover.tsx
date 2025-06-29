import React from 'react';
import { useNewsletter } from '../../context/NewsletterContext';

const NewsletterCover: React.FC = () => {
  const { 
    title, 
    subtitle, 
    year, 
    organizationName,
    email,
    website
  } = useNewsletter();

  return (
    <div className="bg-black h-screen text-white relative overflow-hidden">
      {/* Background image - grayscale */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Cybersecurity Background" 
          className="w-full h-full object-cover grayscale"
          crossOrigin="anonymous"
        />
      </div>
      
      {/* Org Logo */}
      <div className="absolute top-0 right-0 bg-red-700 p-5 z-10">
        <h2 className="text-3xl font-bold text-white">{organizationName.split(' ')[0]}</h2>
      </div>
      
      {/* Main Content - CENTERED with EXPLICIT SPACING */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Year and Title - CENTERED with EXPLICIT MARGIN */}
            <div 
              className="flex items-center justify-center"
              style={{ marginBottom: '3rem' }} // Explicit 48px margin instead of mb-6
            >
              <h1 
                className="text-8xl font-bold leading-none text-red-700"
                style={{ marginRight: '1rem' }} // Explicit 16px margin instead of mr-4
              >
                {year}
              </h1>
              <div className="text-center">
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight uppercase tracking-wider">
                  {title}
                </h1>
                <h2 
                  className="text-2xl sm:text-3xl font-medium uppercase"
                  style={{ marginTop: '0.5rem' }} // Explicit 8px margin instead of mt-2
                >
                  {subtitle}
                </h2>
              </div>
            </div>
            
            {/* Tagline - CENTERED with EXPLICIT POSITIONING */}
            <div className="flex justify-center">
              <div 
                className="bg-red-700 inline-block relative z-20"
                style={{ 
                  padding: '0.5rem 1rem', // Explicit padding instead of py-2 px-4
                  backgroundColor: '#b91c1c' // Explicit color
                }}
              >
                <h3 
                  className="text-lg font-medium text-white text-center"
                  style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    lineHeight: '1.75rem',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    margin: '0' // Ensure no margin
                  }}
                >
                  CYBERSECURITY INSIGHTS FOR COMPREHENSIVE PROTECTION
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with contact details */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-center text-white z-10">
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span>Latest Cyber Threats and Vulnerability Alerts</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span>Essential Security Best Practices for Protection</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span>Stay Ahead with Cybersecurity Insights & Updates</span>
          </li>
        </ul>
        <div className="text-right">
          <p>Our Mail :</p>
          <p>{email}</p>
          <p className="mt-2">Our Website :</p>
          <p>{website}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCover;