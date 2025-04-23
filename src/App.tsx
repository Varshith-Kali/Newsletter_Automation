import React from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';

function App() {
  return (
    <NewsletterProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Cybersecurity Newsletter Editor</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Newsletter Content</h2>
              <NewsletterEditor />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Newsletter Preview</h2>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Newsletter />
              </div>
                <button
                  onClick={() => window.print()}
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-lg block mx-auto"
                  >
                  Download Newsletter (PDF)
                </button>
            </div>
          </div>
        </div>
      </div>
    </NewsletterProvider>
  );
}

export default App;