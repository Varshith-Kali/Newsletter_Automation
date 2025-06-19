import React from 'react';
import { useNewsletter } from '../../context/NewsletterContext';

const NewsletterThreats: React.FC = () => {
  const { threats } = useNewsletter();

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const colors = {
      'CRITICAL': { backgroundColor: '#dc2626', color: 'white' },
      'HIGH': { backgroundColor: '#f97316', color: 'white' },
      'MEDIUM': { backgroundColor: '#eab308', color: 'black' },
      'LOW': { backgroundColor: '#16a34a', color: 'white' }
    };
    
    const style = colors[severity as keyof typeof colors] || { backgroundColor: '#6b7280', color: 'white' };
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRadius: '4px',
        marginLeft: '8px',
        ...style
      }}>
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

  const handleThreatClick = (link?: string) => {
    if (link) {
      console.log('Opening link:', link);
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      console.log('No link available for this threat');
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'white', 
      color: 'black', 
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      {/* Left red sidebar with images */}
      <div style={{ width: '41.666667%', backgroundColor: '#b91c1c', position: 'relative' }}>
        <div style={{ height: '33.333333%', overflow: 'hidden' }}>
          <img 
            src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Cybersecurity" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'grayscale(100%)'
            }}
            crossOrigin="anonymous"
          />
        </div>
        <div style={{ height: '33.333333%', overflow: 'hidden' }}>
          <img 
            src="https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Hacker" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'grayscale(100%)'
            }}
            crossOrigin="anonymous"
          />
        </div>
        <div style={{ height: '33.333333%', overflow: 'hidden' }}>
          <img 
            src="https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Security" 
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
      
      {/* Right side with content */}
      <div style={{ width: '58.333333%', padding: '32px' }}>
        <h2 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '32px',
          margin: '0 0 32px 0'
        }}>
          SECURITY FLAWS, ZERO-DAY ATTACKS & VULNERABILITIES
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {threats.map((threat, index) => (
            <div key={threat.id} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  flex: 1,
                  margin: '0 0 8px 0'
                }}>
                  <span 
                    onClick={() => handleThreatClick(threat.link)}
                    style={{
                      color: 'black',
                      transition: 'all 0.2s',
                      cursor: threat.link ? 'pointer' : 'default',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      if (threat.link) {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.textDecoration = 'underline';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'black';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                    title={threat.link ? 'Click to read more' : 'No source link available'}
                  >
                    {index + 1}. {threat.title}
                  </span>
                  {getSeverityBadge(threat.severity)}
                </h3>
              </div>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.5', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                {threat.description}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                fontSize: '12px', 
                color: '#6b7280' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {threat.source && (
                    <span style={{ fontStyle: 'italic' }}>Source: {threat.source}</span>
                  )}
                  {threat.cves && threat.cves.length > 0 && (
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {threat.cves.join(', ')}
                    </span>
                  )}
                  <span style={{ color: '#4b5563', fontWeight: '500' }}>
                    {formatDate(threat.formattedDate, threat.pubDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {threats.length > 4 && (
          <div style={{ 
            marginTop: '32px', 
            backgroundColor: '#fef2f2', 
            padding: '16px', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            borderLeft: '4px solid #dc2626' 
          }}>
            ⚠️ CRITICAL ALERT: MULTIPLE HIGH-SEVERITY VULNERABILITIES DETECTED. IMMEDIATE ACTION REQUIRED.
          </div>
        )}
        
        <div style={{ 
          marginTop: '32px', 
          backgroundColor: '#f9fafb', 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb' 
        }}>
          <h4 style={{ 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            📊 Threat Intelligence Summary
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            fontSize: '14px', 
            color: '#4b5563' 
          }}>
            <div>
              <span style={{ fontWeight: '500' }}>Total Incidents:</span> {threats.length}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>CVEs Identified:</span> {threats.reduce((acc, t) => acc + (t.cves?.length || 0), 0)}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>Critical/High:</span> {threats.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH').length}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>Sources:</span> {[...new Set(threats.map(t => t.source))].length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterThreats;