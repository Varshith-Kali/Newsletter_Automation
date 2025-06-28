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
      console.log('📄 Generating PDF with enhanced quality...');
      
      // Ensure the element is visible and properly rendered
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced html2canvas options for better quality
      const canvas = await html2canvas(content, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: true, // Better rendering
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: () => false,
        // Enhanced onclone to ensure proper styling
        onclone: (clonedDoc, element) => {
          console.log('🎨 Enhancing cloned document for better quality...');
          
          // Force all elements to have proper opacity and colors
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              
              // Ensure proper background colors
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                el.style.backgroundColor = computedStyle.backgroundColor;
              }
              
              // Ensure proper text colors
              if (computedStyle.color) {
                el.style.color = computedStyle.color;
              }
              
              // Remove any transparency issues
              if (el.style.opacity && parseFloat(el.style.opacity) < 1) {
                el.style.opacity = '1';
              }
            }
          });
          
          // Ensure images are properly loaded and visible
          const images = element.querySelectorAll('img');
          images.forEach((img) => {
            if (img instanceof HTMLImageElement) {
              img.style.opacity = '1';
              img.style.filter = 'none'; // Remove any filters that might cause dimming
            }
          });
          
          // Add a style to ensure everything is bright and clear
          const enhanceStyle = clonedDoc.createElement('style');
          enhanceStyle.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .bg-red-700 {
              background-color: #b91c1c !important;
            }
            
            .bg-black {
              background-color: #000000 !important;
            }
            
            .bg-white {
              background-color: #ffffff !important;
            }
            
            .text-white {
              color: #ffffff !important;
            }
            
            .text-black {
              color: #000000 !important;
            }
            
            .text-red-700 {
              color: #b91c1c !important;
            }
            
            img {
              opacity: 1 !important;
              filter: none !important;
            }
          `;
          
          clonedDoc.head.appendChild(enhanceStyle);
          console.log('✅ Document enhancement complete');
        }
      });

      console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🎉 PDF generated successfully!');
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      alert('PDF download failed: ' + error.message);
    }
  };

  const downloadAsPNG = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('🖼️ Generating PNG with enhanced quality...');
      
      // Ensure the element is visible and properly rendered
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Same enhanced options as PDF
      const canvas = await html2canvas(content, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          console.log('🎨 Enhancing cloned document for PNG...');
          
          // Force all elements to have proper opacity and colors
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              
              // Ensure proper background colors
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                el.style.backgroundColor = computedStyle.backgroundColor;
              }
              
              // Ensure proper text colors
              if (computedStyle.color) {
                el.style.color = computedStyle.color;
              }
              
              // Remove any transparency issues
              if (el.style.opacity && parseFloat(el.style.opacity) < 1) {
                el.style.opacity = '1';
              }
            }
          });
          
          // Ensure images are properly loaded and visible
          const images = element.querySelectorAll('img');
          images.forEach((img) => {
            if (img instanceof HTMLImageElement) {
              img.style.opacity = '1';
              img.style.filter = 'none';
            }
          });
          
          // Add enhancement styles
          const enhanceStyle = clonedDoc.createElement('style');
          enhanceStyle.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .bg-red-700 {
              background-color: #b91c1c !important;
            }
            
            .bg-black {
              background-color: #000000 !important;
            }
            
            .bg-white {
              background-color: #ffffff !important;
            }
            
            .text-white {
              color: #ffffff !important;
            }
            
            .text-black {
              color: #000000 !important;
            }
            
            .text-red-700 {
              color: #b91c1c !important;
            }
            
            img {
              opacity: 1 !important;
              filter: none !important;
            }
          `;
          
          clonedDoc.head.appendChild(enhanceStyle);
          console.log('✅ PNG enhancement complete');
        }
      });

      console.log(`📸 PNG canvas: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🎉 PNG generated successfully!');
      
    } catch (error) {
      console.error('❌ PNG generation failed:', error);
      alert('PNG download failed: ' + error.message);
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
                className="newsletter-container border border-gray-300 rounded-lg overflow-hidden bg-white"
                style={{ 
                  backgroundColor: 'white',
                  position: 'relative',
                  width: '100%',
                  height: 'auto'
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