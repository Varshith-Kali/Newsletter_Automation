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
        printWindow.document.write(`
          <html>
            <head>
              <title>Cybersecurity Newsletter</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }

                html, body {
                  background: white !important;
                  margin: 0;
                  padding: 0;
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }

                @page {
                  margin: 0;
                  size: A4;
                }

                @media print {
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                  
                  body {
                    overflow: visible !important;
                  }
                  
                  .newsletter-page {
                    page-break-after: always !important;
                    page-break-inside: avoid !important;
                    break-after: page !important;
                    break-inside: avoid !important;
                    min-height: 100vh !important;
                    height: 100vh !important;
                  }
                  
                  .newsletter-page:last-child {
                    page-break-after: auto !important;
                    break-after: auto !important;
                  }
                  
                  img {
                    max-width: 100% !important;
                    height: auto !important;
                    display: block !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .bg-red-700, .bg-red-600 {
                    background-color: #b91c1c !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .bg-black {
                    background-color: #000000 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .bg-white {
                    background-color: #ffffff !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .text-white {
                    color: #ffffff !important;
                  }
                  
                  .text-red-700 {
                    color: #b91c1c !important;
                  }
                  
                  .grayscale {
                    filter: grayscale(100%) !important;
                    -webkit-filter: grayscale(100%) !important;
                  }
                }

                .newsletter-print-wrapper {
                  width: 100%;
                  overflow: visible;
                }
              </style>
            </head>
            <body>
              <div class="newsletter-print-wrapper">
                ${content.innerHTML}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
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