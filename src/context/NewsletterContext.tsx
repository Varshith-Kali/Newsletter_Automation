import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Threat {
  id: string;
  title: string;
  description: string;
  severity?: string;
  source?: string;
}

export interface BestPractice {
  id: string;
  content: string;
}

export interface TrainingItem {
  id: string;
  content: string;
}

interface NewsletterContextType {
  title: string;
  setTitle: (title: string) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  year: string;
  setYear: (year: string) => void;
  organizationName: string;
  setOrganizationName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  threats: Threat[];
  setThreats: (threats: Threat[]) => void;
  addThreat: () => void;
  updateThreat: (id: string, field: keyof Threat, value: string) => void;
  removeThreat: (id: string) => void;
  bestPractices: BestPractice[];
  setBestPractices: (practices: BestPractice[]) => void;
  addBestPractice: () => void;
  updateBestPractice: (id: string, content: string) => void;
  removeBestPractice: (id: string) => void;
  trainingItems: TrainingItem[];
  setTrainingItems: (items: TrainingItem[]) => void;
  addTrainingItem: () => void;
  updateTrainingItem: (id: string, content: string) => void;
  removeTrainingItem: (id: string) => void;
  thoughtOfTheDay: string;
  setThoughtOfTheDay: (thought: string) => void;
  securityJoke: string;
  setSecurityJoke: (joke: string) => void;
  autoUpdateContent: () => Promise<void>;
  isUpdating: boolean;
  lastUpdated: string | null;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
};

export const NewsletterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('CYBERPULSE');
  const [subtitle, setSubtitle] = useState('PROTECTING WHAT MATTERS');
  const [year, setYear] = useState('2025');
  const [organizationName, setOrganizationName] = useState('ACME SECURITY');
  const [email, setEmail] = useState('security@acmecorp.com');
  const [website, setWebsite] = useState('www.acmesecurity.com');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: '1',
      title: 'Critical Microsoft Exchange Vulnerability (CVE-2023-29357)',
      description: 'A zero-day exploit allows attackers to escalate privileges remotely. Patches released – ensure immediate updates for on-premises servers.',
      severity: 'CRITICAL'
    },
    {
      id: '2',
      title: 'Log4j 2 Resurfaces with New Flaw (CVE-2023-31038)',
      description: 'Apache patched a high-severity RCE vulnerability. Check dependencies in your Java apps.',
      severity: 'HIGH'
    },
    {
      id: '3',
      title: 'Jenkins Servers Targeted in Ransomware Campaigns',
      description: 'Unpatched Jenkins installations are being exploited to deploy cryptominers. Enforce access controls and disable unused plugins.',
      severity: 'HIGH'
    },
    {
      id: '4',
      title: 'Phishing Campaigns via Fake GitHub Clones',
      description: 'Attackers use Google Ads to mimic GitHub repositories. Train teams to verify URLs and avoid "urgent" clone requests.',
      severity: 'MEDIUM'
    }
  ]);
  
  const [bestPractices, setBestPractices] = useState<BestPractice[]>([
    { id: '1', content: 'Implement multi-factor authentication across all critical systems and applications.' },
    { id: '2', content: 'Maintain regular security patches and updates for all software components.' },
    { id: '3', content: 'Conduct regular security awareness training for all employees.' },
    { id: '4', content: 'Establish network segmentation to limit lateral movement of threats.' }
  ]);
  
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([
    { id: '1', content: 'Phishing recognition and reporting procedures for all staff members.' },
    { id: '2', content: 'Secure coding practices workshop for development teams.' },
    { id: '3', content: 'Incident response simulation exercises and tabletop scenarios.' }
  ]);
  
  const [thoughtOfTheDay, setThoughtOfTheDay] = useState('IN CYBERSECURITY, PARANOIA IS A VIRTUE. THE QUESTION ISN\'T "IF" BUT "WHEN" - SO BUILD WALLS TODAY THAT WITHSTAND TOMORROW\'S SIEGE.');
  const [securityJoke, setSecurityJoke] = useState('WHY DID THE CYBERSECURITY EXPERT BRING A LADDER TO WORK? TO CLIMB THE FIREWALL!');
  
  // Load content from JSON file on mount
  useEffect(() => {
    loadSavedContent();
  }, []);
  
  const loadSavedContent = async () => {
    try {
      const response = await fetch('/src/data/newsletter-content.json');
      if (response.ok) {
        const data = await response.json();
        if (data.threats) setThreats(data.threats);
        if (data.bestPractices) setBestPractices(data.bestPractices);
        if (data.trainingItems) setTrainingItems(data.trainingItems);
        if (data.thoughtOfTheDay) setThoughtOfTheDay(data.thoughtOfTheDay);
        if (data.securityJoke) setSecurityJoke(data.securityJoke);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      }
    } catch (error) {
      console.log('No saved content found, using defaults');
    }
  };
  
  const autoUpdateContent = async () => {
    setIsUpdating(true);
    try {
      console.log('🚀 Starting auto-update...');
      
      // Simulate the news fetching and AI processing
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: "Recent cybersecurity threats include new vulnerabilities in Microsoft Exchange servers, ongoing phishing campaigns targeting GitHub users, and ransomware attacks on Jenkins installations. Security experts recommend implementing multi-factor authentication and maintaining regular security patches.",
          parameters: {
            max_length: 100,
            min_length: 30
          }
        })
      });
      
      // Generate new threats with AI-like processing
      const newThreats = [
        {
          id: '1',
          title: 'Zero-Day Exploit in Popular Web Framework (CVE-2025-0001)',
          description: 'Critical remote code execution vulnerability discovered in widely-used framework. Immediate patching required.',
          severity: 'CRITICAL'
        },
        {
          id: '2',
          title: 'Advanced Persistent Threat Targeting Financial Institutions',
          description: 'Sophisticated malware campaign specifically designed to infiltrate banking systems and steal credentials.',
          severity: 'HIGH'
        },
        {
          id: '3',
          title: 'Supply Chain Attack via Compromised NPM Package',
          description: 'Popular JavaScript library compromised with malicious code affecting thousands of applications.',
          severity: 'HIGH'
        },
        {
          id: '4',
          title: 'AI-Generated Phishing Emails Bypass Traditional Filters',
          description: 'Machine learning-crafted phishing attempts showing increased success rates against standard detection.',
          severity: 'MEDIUM'
        }
      ];
      
      const newBestPractices = [
        { id: '1', content: 'Deploy advanced threat detection systems with AI-powered analysis capabilities.' },
        { id: '2', content: 'Implement zero-trust architecture with continuous verification protocols.' },
        { id: '3', content: 'Establish automated incident response workflows for faster threat mitigation.' },
        { id: '4', content: 'Conduct regular red team exercises to test security posture effectiveness.' }
      ];
      
      const newTrainingItems = [
        { id: '1', content: 'AI-generated phishing detection workshop for all employees.' },
        { id: '2', content: 'Supply chain security assessment training for development teams.' },
        { id: '3', content: 'Advanced persistent threat simulation and response exercises.' }
      ];
      
      const thoughts = [
        'SECURITY IS NOT A DESTINATION, BUT A CONTINUOUS JOURNEY OF ADAPTATION AND VIGILANCE.',
        'IN THE AGE OF AI, BOTH ATTACKERS AND DEFENDERS MUST EVOLVE - STAY AHEAD OF THE CURVE.',
        'THE HUMAN ELEMENT REMAINS THE STRONGEST AND WEAKEST LINK IN CYBERSECURITY.',
        'ASSUME BREACH, PLAN FOR RESILIENCE, AND ALWAYS HAVE A RECOVERY STRATEGY.'
      ];
      
      const jokes = [
        'WHY DO CYBERSECURITY EXPERTS MAKE GREAT COMEDIANS? THEY KNOW ALL ABOUT TIMING ATTACKS!',
        'WHAT DID THE FIREWALL SAY TO THE HACKER? "YOU SHALL NOT PASS(WORD)!"',
        'WHY DON\'T SECURITY PROFESSIONALS TRUST ATOMS? BECAUSE THEY MAKE UP EVERYTHING!',
        'HOW DO YOU KNOW IF A HACKER IS EXTROVERTED? THEY STARE AT YOUR SHOES INSTEAD OF THEIR OWN!'
      ];
      
      // Update all content
      setThreats(newThreats);
      setBestPractices(newBestPractices);
      setTrainingItems(newTrainingItems);
      setThoughtOfTheDay(thoughts[Math.floor(Math.random() * thoughts.length)]);
      setSecurityJoke(jokes[Math.floor(Math.random() * jokes.length)]);
      setLastUpdated(new Date().toISOString());
      
      console.log('✅ Content updated successfully!');
      
    } catch (error) {
      console.error('❌ Error updating content:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const addThreat = () => {
    const newThreat: Threat = {
      id: Date.now().toString(),
      title: 'New Security Threat',
      description: 'Description of the new security threat.',
      severity: 'MEDIUM'
    };
    setThreats([...threats, newThreat]);
  };
  
  const updateThreat = (id: string, field: keyof Threat, value: string) => {
    setThreats(threats.map(threat => 
      threat.id === id ? { ...threat, [field]: value } : threat
    ));
  };
  
  const removeThreat = (id: string) => {
    setThreats(threats.filter(threat => threat.id !== id));
  };
  
  const addBestPractice = () => {
    const newPractice: BestPractice = {
      id: Date.now().toString(),
      content: 'New security best practice'
    };
    setBestPractices([...bestPractices, newPractice]);
  };
  
  const updateBestPractice = (id: string, content: string) => {
    setBestPractices(bestPractices.map(practice => 
      practice.id === id ? { ...practice, content } : practice
    ));
  };
  
  const removeBestPractice = (id: string) => {
    setBestPractices(bestPractices.filter(practice => practice.id !== id));
  };
  
  const addTrainingItem = () => {
    const newItem: TrainingItem = {
      id: Date.now().toString(),
      content: 'New training spotlight item'
    };
    setTrainingItems([...trainingItems, newItem]);
  };
  
  const updateTrainingItem = (id: string, content: string) => {
    setTrainingItems(trainingItems.map(item => 
      item.id === id ? { ...item, content } : item
    ));
  };
  
  const removeTrainingItem = (id: string) => {
    setTrainingItems(trainingItems.filter(item => item.id !== id));
  };
  
  const value = {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    year,
    setYear,
    organizationName,
    setOrganizationName,
    email,
    setEmail,
    website,
    setWebsite,
    threats,
    setThreats,
    addThreat,
    updateThreat,
    removeThreat,
    bestPractices,
    setBestPractices,
    addBestPractice,
    updateBestPractice,
    removeBestPractice,
    trainingItems,
    setTrainingItems,
    addTrainingItem,
    updateTrainingItem,
    removeTrainingItem,
    thoughtOfTheDay,
    setThoughtOfTheDay,
    securityJoke,
    setSecurityJoke,
    autoUpdateContent,
    isUpdating,
    lastUpdated
  };
  
  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};