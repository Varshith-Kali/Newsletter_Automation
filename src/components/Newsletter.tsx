import React from 'react';
import { useNewsletter } from '../context/NewsletterContext';
import NewsletterCover from './newsletter/NewsletterCover';
import NewsletterThreats from './newsletter/NewsletterThreats';
import NewsletterBestPractices from './newsletter/NewsletterBestPractices';

const Newsletter: React.FC = () => {
  const { title } = useNewsletter();
  
  return (
    <div className="newsletter w-full">
      <div className="newsletter-page newsletter-cover">
        <NewsletterCover />
      </div>
      <div className="newsletter-page newsletter-threats">
        <NewsletterThreats />
      </div>
      <div className="newsletter-page newsletter-best-practices">
        <NewsletterBestPractices />
      </div>
    </div>
  );
};

export default Newsletter;