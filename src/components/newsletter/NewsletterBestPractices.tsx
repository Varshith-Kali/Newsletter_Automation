import React from 'react';
import { useNewsletter } from '../../context/NewsletterContext';

const NewsletterBestPractices: React.FC = () => {
  const { 
    bestPractices, 
    trainingItems, 
    thoughtOfTheDay, 
    securityJoke 
  } = useNewsletter();

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      {/* Left side with red background */}
      <div style={{ 
        width: '41.666667%', 
        backgroundColor: '#b91c1c', 
        color: 'white', 
        padding: '32px', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            BEST PRACTICES &<br />AWARENESS
          </h2>
          <h3 style={{ 
            fontSize: '24px', 
            marginBottom: '32px',
            margin: '0 0 32px 0'
          }}>
            ACTIONABLE<br />RECOMMENDATIONS
          </h3>
          <h4 style={{ 
            textTransform: 'uppercase', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            STRENGTHENING SECURITY<br />WITH KNOWLEDGE AND ACTION
          </h4>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '32px 0' }}>
          {bestPractices.map((practice) => (
            <p key={practice.id} style={{ 
              fontSize: '14px', 
              lineHeight: '1.5',
              margin: 0
            }}>
              {practice.content}
            </p>
          ))}
        </div>
        
        <div style={{ marginTop: '32px' }}>
          <h4 style={{ 
            textTransform: 'uppercase', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            TRAINING SPOTLIGHT
          </h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {trainingItems.map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: 'white', 
                  borderRadius: '50%', 
                  marginTop: '8px', 
                  marginRight: '8px',
                  flexShrink: 0
                }}></span>
                <span style={{ fontSize: '14px' }}>{item.content}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          {/* Abstract security pattern */}
          <div style={{ width: '100%', height: '192px', overflow: 'hidden' }}>
            <img 
              src="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Security Pattern" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'grayscale(100%)'
              }}
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
      
      {/* Right side with images and quote */}
      <div style={{ width: '58.333333%', backgroundColor: 'white', position: 'relative' }}>
        {/* Background city image */}
        <div style={{ height: '66.666667%', overflow: 'hidden' }}>
          <img 
            src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Night City" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'grayscale(100%)'
            }}
            crossOrigin="anonymous"
          />
          
          {/* Red overlay box */}
          <div style={{ 
            position: 'absolute', 
            top: '32px', 
            left: '32px', 
            backgroundColor: '#b91c1c', 
            padding: '24px', 
            maxWidth: '384px', 
            color: 'white' 
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              THOUGHT OF THE DAY !!
            </h3>
            <p style={{ 
              fontSize: '14px', 
              fontStyle: 'italic',
              margin: 0
            }}>
              {thoughtOfTheDay}
            </p>
          </div>
        </div>
        
        {/* Bottom section with joke */}
        <div style={{ height: '33.333333%', padding: '32px', display: 'flex' }}>
          <div style={{ width: '50%', paddingRight: '16px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              SECURITY JOKE OF THE MONTH
            </h3>
            <p style={{ 
              fontSize: '14px',
              margin: 0
            }}>
              {securityJoke}
            </p>
          </div>
          <div style={{ width: '50%' }}>
            <img 
              src="https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Person working" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'grayscale(100%)'
              }}
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBestPractices;