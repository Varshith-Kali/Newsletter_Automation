import React, { createContext, useContext, useState } from 'react';

export interface Threat {
  id: string;
  title: string;
  description: string;
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
  
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: '1',
      title: 'Critical Microsoft Exchange Vulnerability (CVE-2023-29357)',
      description: 'A zero-day exploit allows attackers to escalate privileges remotely. Patches released – ensure immediate updates for on-premises servers.'
    },
    {
      id: '2',
      title: 'Log4j 2 Resurfaces with New Flaw (CVE-2023-31038)',
      description: 'Apache patched a high-severity RCE vulnerability. Check dependencies in your Java apps.'
    },
    {
      id: '3',
      title: 'Jenkins Servers Targeted in Ransomware Campaigns',
      description: 'Unpatched Jenkins installations are being exploited to deploy cryptominers. Enforce access controls and disable unused plugins.'
    },
    {
      id: '4',
      title: 'Phishing Campaigns via Fake GitHub Clones',
      description: 'Attackers use Google Ads to mimic GitHub repositories. Train teams to verify URLs and avoid "urgent" clone requests.'
    },
    {
      id: '5',
      title: 'Critical Infrastructure Flaw in Siemens PLCs',
      description: 'INDUSTRIAL SYSTEMS VULNERABLE TO UNAUTHENTICATED COMMAND EXECUTION. ISOLATE OT NETWORKS AND APPLY VENDOR PATCHES.'
    }
  ]);
  
  const [bestPractices, setBestPractices] = useState<BestPractice[]>([
    { id: '1', content: 'Patch Faster: Prioritize updates for Microsoft Exchange, Jenkins, and Log4j dependencies.' },
    { id: '2', content: 'Enforce MFA Everywhere: Especially for CI/CD tools like GitHub and Jenkins.' },
    { id: '3', content: 'Audit Third-Party Code: Use SCA tools (e.g., Snyk) to detect vulnerable dependencies.' },
    { id: '4', content: 'Segment Networks: Isolate OT/IoT devices from core banking systems.' }
  ]);
  
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([
    { id: '1', content: 'Assume breach: Conduct weekly log reviews for unusual API calls or unauthorized access to SWIFT-related systems' },
    { id: '2', content: 'Phishing Simulation: Launch a mock campaign using fake GitHub security alerts to test employee vigilance' },
    { id: '3', content: 'OWASP Top 10 for Developers: Host a workshop on insecure design (A4) and software supply chain risks (A8)' }
  ]);
  
  const [thoughtOfTheDay, setThoughtOfTheDay] = useState('IN CYBERSECURITY, PARANOIA IS A VIRTUE. THE QUESTION ISN\'T "IF" BUT "WHEN" - SO BUILD WALLS TODAY THAT WITHSTAND TOMORROW\'S SIEGE.');
  const [securityJoke, setSecurityJoke] = useState('WHY DID THE CYBERSECURITY EXPERT BRING A LADDER TO WORK? TO CLIMB THE FIREWALL!');
  
  const addThreat = () => {
    const newThreat: Threat = {
      id: Date.now().toString(),
      title: 'New Security Threat',
      description: 'Description of the new security threat.'
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
    setSecurityJoke
  };
  
  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};