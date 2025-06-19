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
      console.log('Content element:', content);
      console.log('Content dimensions:', content.offsetWidth, 'x', content.offsetHeight);
      
      // Scroll to top to ensure full content is visible
      window.scrollTo(0, 0);
      
      // Wait for any animations or transitions to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure all images are loaded
      const images = content.querySelectorAll('img');
      console.log('Found images:', images.length);
      
      await Promise.all(Array.from(images).map((img, index) => {
        console.log(`Image ${index + 1}:`, img.src, 'Complete:', img.complete);
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = () => {
            console.log(`Image ${index + 1} loaded`);
            resolve(undefined);
          };
          img.onerror = () => {
            console.log(`Image ${index + 1} failed to load`);
            resolve(undefined);
          };
        });
      }));

      console.log('All images processed, creating canvas...');
      
      // Create canvas with optimized settings
      const canvas = await html2canvas(content, {
        scale: 1.5, // Reduced scale for better performance
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        letterRendering: true,
        foreignObjectRendering: false, // Disable for better compatibility
        scrollX: 0,
        scrollY: 0,
        width: content.scrollWidth,
        height: content.scrollHeight,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        onclone: (clonedDoc) => {
          console.log('Cloning document...');
          const clonedContent = clonedDoc.querySelector('[data-newsletter-content]');
          if (clonedContent) {
            clonedContent.style.backgroundColor = '#ffffff';
            clonedContent.style.transform = 'none';
            clonedContent.style.position = 'static';
          }
        }
      });

      console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      const imgData = canvas.toDataURL('image/png', 0.95);
      console.log('Image data created, length:', imgData.length);
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      // Create PDF with A4 proportions
      const pdfWidth = ratio > 1 ? 297 : 210; // A4 landscape or portrait
      const pdfHeight = ratio > 1 ? 210 : 297;
      
      const pdf = new jsPDF({
        orientation: ratio > 1 ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate scaling to fit A4
      const scale = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
      const scaledWidth = imgWidth * 0.264583 * scale;
      const scaledHeight = imgHeight * 0.264583 * scale;
      
      // Center the image on the page
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      pdf.save('Cybersecurity-Newsletter.pdf');
      
      console.log('PDF generated and saved successfully');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF download failed. Error: ' + error.message + '\nPlease check the console for more details.');
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
      console.log('Content element:', content);
      console.log('Content dimensions:', content.offsetWidth, 'x', content.offsetHeight);
      
      // Scroll to top to ensure full content is visible
      window.scrollTo(0, 0);
      
      // Wait for any animations or transitions to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure all images are loaded
      const images = content.querySelectorAll('img');
      console.log('Found images:', images.length);
      
      await Promise.all(Array.from(images).map((img, index) => {
        console.log(`Image ${index + 1}:`, img.src, 'Complete:', img.complete);
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = () => {
            console.log(`Image ${index + 1} loaded`);
            resolve(undefined);
          };
          img.onerror = () => {
            console.log(`Image ${index + 1} failed to load`);
            resolve(undefined);
          };
        });
      }));

      console.log('All images processed, creating canvas...');
      
      const canvas = await html2canvas(content, {
        scale: 2, // Higher scale for PNG
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        letterRendering: true,
        foreignObjectRendering: false,
        scrollX: 0,
        scrollY: 0,
        width: content.scrollWidth,
        height: content.scrollHeight,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        onclone: (clonedDoc) => {
          console.log('Cloning document...');
          const clonedContent = clonedDoc.querySelector('[data-newsletter-content]');
          if (clonedContent) {
            clonedContent.style.backgroundColor = '#ffffff';
            clonedContent.style.transform = 'none';
            clonedContent.style.position = 'static';
          }
        }
      });

      console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      // Create download link
      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('PNG generated and downloaded successfully');
      
    } catch (error) {
      console.error('PNG generation failed:', error);
      alert('PNG download failed. Error: ' + error.message + '\nPlease check the console for more details.');
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
                data-newsletter-content
                className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                style={{ 
                  backgroundColor: 'white',
                  minHeight: '800px',
                  position: 'relative'
                }}
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