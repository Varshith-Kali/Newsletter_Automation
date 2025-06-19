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
    <div className="bg-black text-white relative overflow-hidden" style={{ width: '100%', height: '100%', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}>
      {/* Background image - grayscale */}
      <div className="absolute inset-0" style={{ opacity: 0.6 }}>
        <img 
          src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Cybersecurity Background" 
          className="w-full h-full object-cover"
          style={{ 
            filter: 'grayscale(100%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          crossOrigin="anonymous"
        />
      </div>
      
      {/* Org Logo */}
      <div className="absolute top-0 right-0 z-10" style={{ backgroundColor: '#b91c1c', padding: '20px' }}>
        <h2 className="text-white" style={{ fontSize: '48px', fontWeight: 'bold', margin: 0 }}>
          {organizationName.split(' ')[0]}
        </h2>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div style={{ marginTop: 'auto', marginLeft: '32px', marginBottom: '208px' }}>
          <div className="flex items-end">
            <h1 style={{ 
              fontSize: '128px', 
              fontWeight: 'bold', 
              lineHeight: '1', 
              color: '#b91c1c', 
              marginLeft: '-16px', 
              marginRight: '16px',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
            }}>
              {year}
            </h1>
            <div>
              <h1 style={{ 
                fontSize: '96px', 
                fontWeight: 'bold', 
                lineHeight: '1.1', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                margin: 0
              }}>
                {title}
              </h1>
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: '500', 
                marginTop: '8px', 
                textTransform: 'uppercase',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                margin: '8px 0 0 0'
              }}>
                {subtitle}
              </h2>
            </div>
          </div>
          <div style={{ 
            marginTop: '40px', 
            backgroundColor: '#b91c1c', 
            display: 'inline-block', 
            padding: '8px 16px' 
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: '500',
              margin: 0
            }}>
              CYBERSECURITY INSIGHTS FOR COMPREHENSIVE PROTECTION
            </h3>
          </div>
        </div>
      </div>
      
      {/* Bottom section with contact details */}
      <div className="absolute bottom-0 left-0 right-0 text-white z-10" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li className="flex items-center" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></span>
            <span>Latest Cyber Threats and Vulnerability Alerts</span>
          </li>
          <li className="flex items-center" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></span>
            <span>Essential Security Best Practices for Protection</span>
          </li>
          <li className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></span>
            <span>Stay Ahead with Cybersecurity Insights & Updates</span>
          </li>
        </ul>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px 0' }}>Our Mail :</p>
          <p style={{ margin: '0 0 8px 0' }}>{email}</p>
          <p style={{ margin: '0 0 4px 0' }}>Our Website :</p>
          <p style={{ margin: 0 }}>{website}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCover;