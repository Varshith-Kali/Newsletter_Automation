import React, { useRef } from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';

function App() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join('');
            } catch {
              return '';
            }
          })
          .join('');

        printWindow.document.write(`
          <html>
            <head>
              <title>Cybersecurity Newsletter</title>
              <style>${styles}</style>
              <style>
                @page {
                  margin: 0;
                  size: auto;
                }

                html, body {
                  background: white;
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                }

                @media print {
                  body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    overflow: hidden;
                  }
                  .no-break {
                    page-break-inside: avoid;
                    break-inside: avoid;
                  }
                }

                .newsletter-print-wrapper {
                  max-height: 3300px; /* ~3 pages */
                  overflow: hidden;
                }

                img {
                  max-width: 100%;
                  height: auto;
                  display: block;
                }
              </style>
            </head>
            <body>
              <div class="newsletter-print-wrapper no-break">
                ${content.innerHTML}
              </div>
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
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
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-lg block mx-auto print:hidden"
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
