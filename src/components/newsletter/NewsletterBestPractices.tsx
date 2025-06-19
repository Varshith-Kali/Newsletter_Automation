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
    <div className="min-h-screen flex">
      {/* Left side with red background */}
      <div className="w-5/12 bg-red-700 text-white p-8 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            BEST PRACTICES &<br />AWARENESS
          </h2>
          <h3 className="text-xl mb-8">
            ACTIONABLE<br />RECOMMENDATIONS
          </h3>
          <h4 className="uppercase text-sm font-medium mb-4">
            STRENGTHENING SECURITY<br />WITH KNOWLEDGE AND ACTION
          </h4>
        </div>
        
        <div className="space-y-4 my-8">
          {bestPractices.map((practice) => (
            <p key={practice.id} className="text-sm leading-relaxed">
              {practice.content}
            </p>
          ))}
        </div>
        
        <div className="mt-8">
          <h4 className="uppercase text-xl font-bold mb-4">TRAINING SPOTLIGHT</h4>
          <ul className="space-y-6">
            {trainingItems.map((item) => (
              <li key={item.id} className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                <span className="text-sm">{item.content}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto">
          {/* Abstract security pattern */}
          <div className="w-full h-48 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Security Pattern" 
              className="w-full h-full object-cover grayscale"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
      
      {/* Right side with images and quote */}
      <div className="w-7/12 bg-white relative">
        {/* Background city image */}
        <div className="h-2/3 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Night City" 
            className="w-full h-full object-cover grayscale"
            crossOrigin="anonymous"
          />
          
          {/* Red overlay box */}
          <div className="absolute top-8 left-8 bg-red-700 p-6 max-w-md text-white">
            <h3 className="text-xl font-bold mb-4">THOUGHT OF THE DAY !!</h3>
            <p className="text-sm italic">{thoughtOfTheDay}</p>
          </div>
        </div>
        
        {/* Bottom section with joke */}
        <div className="h-1/3 p-8 flex">
          <div className="w-1/2 px-4">
            <h3 className="text-xl font-bold mb-2">SECURITY JOKE OF THE MONTH</h3>
            <p className="text-sm">{securityJoke}</p>
          </div>
          <div className="w-1/2">
            <img 
              src="https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Person working" 
              className="w-full h-full object-cover grayscale"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBestPractices;