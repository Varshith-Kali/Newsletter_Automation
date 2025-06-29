import React from 'react';
import { useNewsletter } from '../context/NewsletterContext';
import NewsletterCover from './newsletter/NewsletterCover';
import NewsletterThreats from './newsletter/NewsletterThreats';
import NewsletterBestPractices from './newsletter/NewsletterBestPractices';

const Newsletter: React.FC = () => {
  const { title } = useNewsletter();
  
  return (
    <div className="newsletter w-full">
      {/* Fixed dimensions for consistent layout across all devices */}
      <div className="newsletter-page newsletter-cover w-full h-[1123px] overflow-hidden">
        <NewsletterCover />
      </div>
      <div className="newsletter-page newsletter-threats w-full h-[1123px] overflow-hidden">
        <NewsletterThreats />
      </div>
      <div className="newsletter-page newsletter-best-practices w-full h-[1123px] overflow-hidden">
        <NewsletterBestPractices />
      </div>
    </div>
  );
};

export default Newsletter;