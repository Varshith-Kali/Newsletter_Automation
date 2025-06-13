import React from 'react';
import { Threat, useNewsletter } from '../context/NewsletterContext';
import { Trash2, RefreshCw, Zap, Clock } from 'lucide-react';

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
    lastUpdated
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

  return (
    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
      {/* AI Auto-Update Section */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="text-red-600" size={24} />
            <h3 className="text-lg font-bold text-red-800">AI-Powered Content Generator</h3>
          </div>
          <button
            onClick={autoUpdateContent}
            disabled={isUpdating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <RefreshCw className={isUpdating ? 'animate-spin' : ''} size={16} />
            <span>{isUpdating ? 'Updating...' : 'Auto-Update Content'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-red-700">🤖 AI Features:</h4>
            <ul className="space-y-1 text-red-600">
              <li>• Real-time news from 10+ cybersecurity feeds</li>
              <li>• Smart threat classification (Critical/High/Medium/Low)</li>
              <li>• CVE extraction and highlighting</li>
              <li>• AI-powered content summarization</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-red-600" />
              <span className="font-semibold text-red-700">Last Updated:</span>
            </div>
            <p className="text-red-600">{formatLastUpdated(lastUpdated)}</p>
            {isUpdating && (
              <div className="flex items-center space-x-2 text-red-600">
                <div className="animate-pulse w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Fetching latest threats...</span>
              </div>
            )}
          </div>
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
          <h3 className="text-lg font-medium">Security Threats</h3>
          <button
            onClick={addThreat}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Threat
          </button>
        </div>
        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="p-4 border border-gray-300 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  {threat.severity && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
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
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              {threat.source && (
                <p className="mt-2 text-xs text-gray-500">Source: {threat.source}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Best Practices</h3>
          <button
            onClick={addBestPractice}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Practice
          </button>
        </div>
        <div className="space-y-4">
          {bestPractices.map((practice) => (
            <div key={practice.id} className="flex items-start space-x-2">
              <textarea
                value={practice.content}
                onChange={(e) => updateBestPractice(practice.id, e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeBestPractice(practice.id)}
                className="p-1 text-gray-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Training Spotlight</h3>
          <button
            onClick={addTrainingItem}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Add Training
          </button>
        </div>
        <div className="space-y-4">
          {trainingItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-2">
              <textarea
                value={item.content}
                onChange={(e) => updateTrainingItem(item.id, e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={() => removeTrainingItem(item.id)}
                className="p-1 text-gray-500 hover:text-red-600"
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