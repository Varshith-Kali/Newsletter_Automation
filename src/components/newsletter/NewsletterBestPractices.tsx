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
    <div className="min-h-screen flex newsletter-best-practices">
      {/* Left side with red background */}
      <div className="w-5/12 bg-red-700 text-white p-8 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            BEST PRACTICES &<br />AWARENESS
          </h2>
        </div>
        
        <div className="space-y-4">
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
        {/* Background city image - FORCED SPECIFIC URL */}
        <div 
          className="h-2/3 overflow-hidden thought-of-day-background relative"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* GRAYSCALE OVERLAY - SEPARATE FROM RED BOX */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'grayscale(100%)',
              zIndex: 1
            }}
          />
          
          {/* RED BOX - COMPLETELY ISOLATED FROM GRAYSCALE */}
          <div 
            className="absolute top-8 left-8 p-6 max-w-md bg-red-700 text-white"
            style={{
              backgroundColor: '#b91c1c',
              color: '#ffffff',
              zIndex: 10,
              position: 'absolute',
              isolation: 'isolate'
            }}
          >
            <h3 
              className="text-xl font-bold mb-4 text-white"
              style={{
                color: '#ffffff'
              }}
            >
              THOUGHT OF THE DAY !!
            </h3>
            <p 
              className="text-sm italic text-white"
              style={{
                color: '#ffffff'
              }}
            >
              {thoughtOfTheDay}
            </p>
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