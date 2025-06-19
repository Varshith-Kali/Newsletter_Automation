import React, { useRef } from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const printRef = useRef<HTMLDivElement>(null);

  const downloadAsPDF = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('Starting PDF generation...');
      
      // Create canvas from the content
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        foreignObjectRendering: true,
        scrollX: 0,
        scrollY: 0,
        width: content.scrollWidth,
        height: content.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: ratio > 1 ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth / 2, imgHeight / 2] // Scale down for PDF
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 2, imgHeight / 2);
      pdf.save('Cybersecurity-Newsletter.pdf');
      
      console.log('PDF generated successfully');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF download failed. Please try again.');
    }
  };

  const downloadAsPNG = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('Starting PNG generation...');
      
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        foreignObjectRendering: true,
        scrollX: 0,
        scrollY: 0,
        width: content.scrollWidth,
        height: content.scrollHeight
      });

      // Create download link
      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('PNG generated successfully');
      
    } catch (error) {
      console.error('PNG generation failed:', error);
      alert('PNG download failed. Please try again.');
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
                style={{ backgroundColor: 'white' }}
              >
                <Newsletter />
              </div>
              <div className="mt-6 flex gap-4 justify-center print:hidden">
                <button
                  onClick={downloadAsPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded shadow-lg transition-colors"
                >
                  📄 Download as PDF
                </button>
                <button
                  onClick={downloadAsPNG}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow-lg transition-colors"
                >
                  🖼️ Download as PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NewsletterProvider>
  );
}

export default App;