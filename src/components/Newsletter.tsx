import React from 'react';
import { useNewsletter } from '../context/NewsletterContext';
import NewsletterCover from './newsletter/NewsletterCover';
import NewsletterThreats from './newsletter/NewsletterThreats';
import NewsletterBestPractices from './newsletter/NewsletterBestPractices';

const Newsletter: React.FC = () => {
  const { title } = useNewsletter();
  
  return (
    <div className="newsletter w-full" style={{ backgroundColor: 'white' }}>
      <div className="newsletter-page newsletter-cover" style={{ minHeight: '800px', backgroundColor: 'black' }}>
        <NewsletterCover />
      </div>
      <div className="newsletter-page newsletter-threats" style={{ minHeight: '800px', backgroundColor: 'white' }}>
        <NewsletterThreats />
      </div>
      <div className="newsletter-page newsletter-best-practices" style={{ minHeight: '800px', backgroundColor: 'white' }}>
        <NewsletterBestPractices />
      </div>
    </div>
  );
};

export default Newsletter;