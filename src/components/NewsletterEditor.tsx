import React from 'react';
import { Threat, useNewsletter } from '../context/NewsletterContext';
import { Trash2, RefreshCw, Zap, Clock, TrendingUp, Shield, Users, Calendar } from 'lucide-react';

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
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800">AI-Powered Threat Intelligence</h3>
              <p className="text-sm text-red-600">Real-time cybersecurity incident monitoring (Past 7 days ONLY)</p>
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
            <span>{isUpdating ? 'Scanning Latest...' : 'Fetch Latest Threats'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">Live Monitoring</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• 20+ cybersecurity RSS feeds</li>
              <li>• <strong>STRICTLY past 7 days</strong></li>
              <li>• Smart duplicate elimination</li>
              <li>• CVE extraction & classification</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">AI Processing</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• Smart threat classification</li>
              <li>• Contextual best practices</li>
              <li>• Automated summarization</li>
              <li>• <strong>Date extraction & display</strong></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-red-600" size={20} />
              <h4 className="font-semibold text-red-700">Date Tracking</h4>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              <li>• Real publication dates</li>
              <li>• "X hours/days ago" format</li>
              <li>• Automatic date validation</li>
              <li>• Weekly cache cleanup</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-red-600" />
            <span className="font-semibold text-red-700">Last Updated:</span>
            <span className="text-red-600">{formatLastUpdated(lastUpdated)}</span>
          </div>
          
          {generationStats && (
            <div className="flex items-center space-x-4 text-red-600">
              <span>📊 {generationStats.threatsGenerated} threats</span>
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
              <span>Scanning latest incidents...</span>
            </div>
          )}
        </div>
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
            <h3 className="text-lg font-medium">Security Flaws, Zero-Day Attacks & Vulnerabilities</h3>
            <p className="text-sm text-gray-600">Latest incidents from the past 7 days with publication dates (minimum 4 required)</p>
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
                  {threat.cves && threat.cves.length > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {threat.cves.join(', ')}
                    </span>
                  )}
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold border border-green-300">
                    {formatThreatDate(threat.formattedDate, threat.pubDate)}
                  </div>
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
                    View Original
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Best Practices & Awareness</h3>
            <p className="text-sm text-gray-600">Contextual recommendations based on current threats (minimum 3 required)</p>
          </div>
          <button
            onClick={addBestPractice}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Practice
          </button>
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
          <div>
            <h3 className="text-lg font-medium">Training Spotlight</h3>
            <p className="text-sm text-gray-600">Relevant training based on current threat landscape (minimum 3 required)</p>
          </div>
          <button
            onClick={addTrainingItem}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Training
          </button>
        </div>
        <div className="space-y-4">
          {trainingItems.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-2">#{index + 1}</span>
              <textarea
                value={item.content}
                onChange={(e) => updateTrainingItem(item.id, e.target.value)}
                rows={2}
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
        <h3 className="text-lg font-medium">Thought of the Day</h3>
        <textarea
          value={thoughtOfTheDay}
          onChange={(e) => setThoughtOfTheDay(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Joke</h3>
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