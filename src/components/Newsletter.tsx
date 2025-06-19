import React from 'react';
import { useNewsletter } from '../context/NewsletterContext';
import NewsletterCover from './newsletter/NewsletterCover';
import NewsletterThreats from './newsletter/NewsletterThreats';
import NewsletterBestPractices from './newsletter/NewsletterBestPractices';

const Newsletter: React.FC = () => {
  const { title } = useNewsletter();
  
  return (
    <div className="newsletter w-full" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' }}>
      <div className="newsletter-page newsletter-cover" style={{ width: '1200px', height: '800px', position: 'relative' }}>
        <NewsletterCover />
      </div>
      <div className="newsletter-page newsletter-threats" style={{ width: '1200px', height: '800px', position: 'relative' }}>
        <NewsletterThreats />
      </div>
      <div className="newsletter-page newsletter-best-practices" style={{ width: '1200px', height: '800px', position: 'relative' }}>
        <NewsletterBestPractices />
      </div>
    </div>
  );
};

export default Newsletter;