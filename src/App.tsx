import React, { useRef } from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';
import html2pdf from 'html2pdf.js';

function App() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    const content = printRef.current;
    if (content) {
      try {
        // Configure html2pdf options for high quality output
        const options = {
          margin: 0,
          filename: 'Cybersecurity-Newsletter.pdf',
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            foreignObjectRendering: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate and download PDF
        await html2pdf().set(options).from(content).save();
        
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF download failed. Please try again.');
      }
    }
  };

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
              <div
                ref={printRef}
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                <Newsletter />
              </div>
              <button
                onClick={handlePrint}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded shadow-lg block mx-auto print:hidden transition-colors"
              >
                📄 Download Newsletter (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </NewsletterProvider>
  );
}

export default App;