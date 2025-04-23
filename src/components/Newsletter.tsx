import React from 'react';
import { useNewsletter } from '../context/NewsletterContext';
import NewsletterCover from './newsletter/NewsletterCover';
import NewsletterThreats from './newsletter/NewsletterThreats';
import NewsletterBestPractices from './newsletter/NewsletterBestPractices';

const Newsletter: React.FC = () => {
  const { title } = useNewsletter();
  
  return (
    <div className="newsletter w-full">
      <NewsletterCover />
      <NewsletterThreats />
      <NewsletterBestPractices />
    </div>
  );
};

export default Newsletter;