import React from 'react';
import { Threat, useNewsletter } from '../context/NewsletterContext';
import { Trash2, RefreshCw, Zap, Clock, TrendingUp, Shield, Users, Calendar, Brain, Target, BarChart3, Lightbulb, Award, BookOpen } from 'lucide-react';

const NewsletterEditor: React.FC = () => {
  const {
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
    updateThreat,
    addThreat,
    removeThreat,
    bestPractices,
    updateBestPractice,
    addBestPractice,
    removeBestPractice,
    trainingItems,
    updateTrainingItem,
    addTrainingItem,
    removeTrainingItem,
    thoughtOfTheDay,
    setThoughtOfTheDay,
    securityJoke,
    setSecurityJoke,
    autoUpdateContent,
    isUpdating,
    lastUpdated,
    generationStats
  } = useNewsletter();

  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getThreatScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 50) return 'bg-red-100 text-red-700';
    if (score >= 30) return 'bg-orange-100 text-orange-700';
    if (score >= 15) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const formatThreatDate = (formattedDate?: string, pubDate?: string) => {
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

  return (
    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
      {/* Enhanced AI Auto-Update Section */}
      <div className="bg-gradient-to-br from-red-50 via-red-100 to-orange-50 p-6 rounded-xl border border-red-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Brain className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800">🌐 Real-Time Threat Intelligence</h3>
              <p className="text-sm text-red-600">Live RSS feeds from 15+ cybersecurity sources - STRICTLY past 7 days only</p>
            </div>
          </div>
          <button
            onClick={autoUpdateContent}
            disabled={isUpdating}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <RefreshCw className={isUpdating ? 'animate-spin' : ''} size={18} />
            <span>{isUpdating ? 'Fetching Live Data...' : '🌐 Fetch Real-Time News'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">🌐 Real-Time Sources</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• <strong>15+ Live RSS Feeds</strong></li>
              <li>• The Hacker News, Krebs, BleepingComputer</li>
              <li>• Dark Reading, Security Week, CyberScoop</li>
              <li>• <strong>STRICTLY past 7 days</strong></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">⚡ Live Processing</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• <strong>Real-time RSS parsing</strong></li>
              <li>• Duplicate removal & filtering</li>
              <li>• <strong>Direct article links</strong></li>
              <li>• Smart threat scoring</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">🎯 Fresh Content</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• <strong>NO repetitive data</strong></li>
              <li>• Weekly fresh content</li>
              <li>• <strong>Real-time timestamps</strong></li>
              <li>• TOP 4 most critical</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-red-600" />
            <span className="font-semibold text-red-700">Last Real-Time Fetch:</span>
            <span className="text-red-600">{formatLastUpdated(lastUpdated)}</span>
          </div>
          
          {generationStats && (
            <div className="flex items-center space-x-4 text-red-600">
              <span>🎯 {generationStats.threatsGenerated} threats</span>
              {generationStats.avgThreatScore && (
                <span>📊 Avg Score: {generationStats.avgThreatScore}</span>
              )}
              <span>🔍 {generationStats.cveCount} CVEs</span>
              <span>📡 {generationStats.sourcesUsed} sources</span>
              {generationStats.newestArticle && (
                <span>📅 {generationStats.newestArticle} - {generationStats.oldestArticle}</span>
              )}
            </div>
          )}
          
          {isUpdating && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="animate-pulse w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Fetching live RSS feeds...</span>
            </div>
          )}
        </div>

        {/* Enhanced Statistics Display */}
        {generationStats && generationStats.severityBreakdown && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <div className="text-red-800 font-bold text-lg">{generationStats.severityBreakdown.critical}</div>
              <div className="text-red-600 text-xs">Critical</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg text-center">
              <div className="text-orange-800 font-bold text-lg">{generationStats.severityBreakdown.high}</div>
              <div className="text-orange-600 text-xs">High</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-center">
              <div className="text-yellow-800 font-bold text-lg">{generationStats.severityBreakdown.medium}</div>
              <div className="text-yellow-600 text-xs">Medium</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <div className="text-blue-800 font-bold text-lg">{generationStats.articlesScanned || 100}</div>
              <div className="text-blue-600 text-xs">Live RSS Articles</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Header Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">🌐 Real-Time Top 4 Critical Threats</h3>
            <p className="text-sm text-gray-600">Live from 15+ RSS sources - STRICTLY past 7 days with direct article links</p>
          </div>
          <button
            onClick={addThreat}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Threat
          </button>
        </div>
        <div className="space-y-4">
          {threats.map((threat, index) => (
            <div key={threat.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  {threat.severity && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  )}
                  {threat.threatScore && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getThreatScoreColor(threat.threatScore)}`}>
                      Score: {threat.threatScore}
                    </span>
                  )}
                  {threat.cves && threat.cves.length > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {threat.cves.join(', ')}
                    </span>
                  )}
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold border border-green-300">
                    {formatThreatDate(threat.formattedDate, threat.pubDate)}
                  </div>
                  {threat.linkType && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      threat.linkType === 'direct' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {threat.linkType === 'direct' ? '🔗 Direct' : '🔍 Search'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeThreat(threat.id)}
                  className="p-1 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                type="text"
                value={threat.title}
                onChange={(e) => updateThreat(threat.id, 'title', e.target.value)}
                className="mb-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={threat.description}
                onChange={(e) => updateThreat(threat.id, 'description', e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {threat.source && (
                    <span>Source: {threat.source}</span>
                  )}
                  {threat.pubDate && (
                    <span>Published: {new Date(threat.pubDate).toLocaleDateString()}</span>
                  )}
                </div>
                {threat.link && (
                  <a 
                    href={threat.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {threat.linkType === 'direct' ? 'View Article' : 'Search Article'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-600" size={20} />
            <div>
              <h3 className="text-lg font-medium">🛡️ AI-Generated Best Practices</h3>
              <p className="text-sm text-gray-600">
                <strong>Automatically generated</strong> based on the 4 current threats above - 
                <span className="text-green-600 font-medium"> Updates when threats change!</span>
              </p>
            </div>
          </div>
          <button
            onClick={addBestPractice}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Practice
          </button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-700">
              🤖 AI Analysis: These practices are contextually generated based on your current threat landscape
            </span>
          </div>
          <p className="text-xs text-green-600">
            The AI analyzes keywords like "Microsoft Exchange", "ransomware", "supply chain", "AI-generated phishing" 
            from your threats to recommend the most relevant security practices.
          </p>
        </div>
        <div className="space-y-4">
          {bestPractices.map((practice, index) => (
            <div key={practice.id} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-2">#{index + 1}</span>
              <textarea
                value={practice.content}
                onChange={(e) => updateBestPractice(practice.id, e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeBestPractice(practice.id)}
                className="p-1 text-gray-500 hover:text-red-600 mt-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Users className="text-blue-600" size={20} />
              <Award className="text-purple-600" size={16} />
              <BookOpen className="text-green-600" size={16} />
            </div>
            <div>
              <h3 className="text-lg font-medium">🎓 AI-Generated Training Spotlight (2 Points)</h3>
              <p className="text-sm text-gray-600">
                <strong>Exactly 2 targeted training recommendations</strong> with <strong>2 most relevant certifications</strong> to mitigate the 4 current threats - 
                <span className="text-blue-600 font-medium"> Short & crisp!</span>
              </p>
            </div>
          </div>
          <button
            onClick={addTrainingItem}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Training
          </button>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-blue-700">
              🤖 AI Analysis: 2 most critical training needs with <strong>2 most relevant certifications</strong> based on your specific threat environment
            </span>
          </div>
          <p className="text-xs text-blue-600 mb-2">
            AI prioritizes training based on threat severity: Microsoft Exchange → patch management, 
            ransomware → incident response, supply chain → security assessment, AI phishing → detection training.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Award className="text-purple-600" size={14} />
                <span className="text-xs font-semibold text-purple-700">Top 2 Certifications</span>
              </div>
              <p className="text-xs text-purple-600"><strong>CISSP, GCIH, GCFA, CISM, CompTIA Security+, CySA+</strong></p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <BookOpen className="text-green-600" size={14} />
                <span className="text-xs font-semibold text-green-700">SANS Training</span>
              </div>
              <p className="text-xs text-green-600">SEC566, FOR508, FOR572, SEC487, MGT512</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {trainingItems.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-2">#{index + 1}</span>
              <textarea
                value={item.content}
                onChange={(e) => updateTrainingItem(item.id, e.target.value)}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeTrainingItem(item.id)}
                className="p-1 text-gray-500 hover:text-red-600 mt-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="text-yellow-600" size={20} />
          <div>
            <h3 className="text-lg font-medium">💭 AI-Generated Thought of the Day</h3>
            <p className="text-sm text-gray-600">
              <strong>Unique technology-focused insights</strong> that change based on date - 
              <span className="text-purple-600 font-medium"> Never repetitive!</span>
            </p>
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600">
            🤖 AI generates unique thoughts about AI, quantum computing, cloud security, zero trust, blockchain, and emerging technologies.
          </p>
        </div>
        <textarea
          value={thoughtOfTheDay}
          onChange={(e) => setThoughtOfTheDay(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="text-green-600" size={20} />
          <div>
            <h3 className="text-lg font-medium">😄 AI-Generated Security Joke</h3>
            <p className="text-sm text-gray-600">
              <strong>Unique technology-focused humor</strong> that rotates weekly - 
              <span className="text-green-600 font-medium"> Fresh & relevant!</span>
            </p>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-green-600">
            🤖 AI creates unique jokes about quantum computing, blockchain, AI security, cloud engineering, and modern cybersecurity concepts.
          </p>
        </div>
        <textarea
          value={securityJoke}
          onChange={(e) => setSecurityJoke(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>
  );
};

export default NewsletterEditor;