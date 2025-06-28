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
      console.log('📄 Generating PDF with forced light theme...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force light theme and capture
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff', // FORCE WHITE BACKGROUND
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          console.log('🎨 Forcing light theme and exact colors...');
          
          // FORCE LIGHT THEME - Override any dark theme
          const lightThemeStyle = clonedDoc.createElement('style');
          lightThemeStyle.textContent = `
            /* FORCE LIGHT THEME - OVERRIDE DARK MODE */
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            
            /* FORCE EXACT NEWSLETTER COLORS */
            .bg-red-700 {
              background-color: #b91c1c !important;
              color: #ffffff !important;
            }
            
            .bg-black {
              background-color: #000000 !important;
              color: #ffffff !important;
            }
            
            .bg-white {
              background-color: #ffffff !important;
              color: #000000 !important;
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
            
            .text-gray-700 {
              color: #374151 !important;
            }
            
            .text-gray-600 {
              color: #4b5563 !important;
            }
            
            .text-gray-500 {
              color: #6b7280 !important;
            }
            
            /* IMAGES */
            img {
              filter: grayscale(100%) !important;
              opacity: 1 !important;
            }
            
            /* LAYOUT */
            .min-h-screen {
              min-height: 100vh !important;
            }
            
            .h-screen {
              height: 100vh !important;
            }
            
            /* REMOVE ANY DARK THEME OVERRIDES */
            * {
              opacity: 1 !important;
            }
            
            /* ENSURE NEWSLETTER CONTAINER IS WHITE */
            .newsletter-container,
            .newsletter,
            .newsletter-page {
              background-color: #ffffff !important;
            }
            
            /* OPACITY CLASSES */
            .opacity-60 {
              opacity: 0.6 !important;
            }
          `;
          
          clonedDoc.head.appendChild(lightThemeStyle);
          
          // Force styles on all elements
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Remove any dark theme classes or styles
              el.style.removeProperty('color-scheme');
              
              // Force specific colors based on classes
              if (el.classList.contains('bg-red-700')) {
                el.style.setProperty('background-color', '#b91c1c', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('bg-black')) {
                el.style.setProperty('background-color', '#000000', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('bg-white')) {
                el.style.setProperty('background-color', '#ffffff', 'important');
                el.style.setProperty('color', '#000000', 'important');
              }
              
              if (el.classList.contains('text-white')) {
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('text-black')) {
                el.style.setProperty('color', '#000000', 'important');
              }
              
              if (el.classList.contains('text-red-700')) {
                el.style.setProperty('color', '#b91c1c', 'important');
              }
              
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
              }
            }
          });
          
          console.log('✅ Light theme forced, colors applied');
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
      console.log('🖼️ Generating PNG with forced light theme...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use same approach as PDF
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff', // FORCE WHITE BACKGROUND
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          // Same light theme forcing as PDF
          const lightThemeStyle = clonedDoc.createElement('style');
          lightThemeStyle.textContent = `
            html, body { background-color: #ffffff !important; color: #000000 !important; }
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            img { filter: grayscale(100%) !important; opacity: 1 !important; }
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            * { opacity: 1 !important; }
            .newsletter-container, .newsletter, .newsletter-page { background-color: #ffffff !important; }
            .opacity-60 { opacity: 0.6 !important; }
          `;
          clonedDoc.head.appendChild(lightThemeStyle);
          
          // Apply same element styling as PDF
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.removeProperty('color-scheme');
              
              if (el.classList.contains('bg-red-700')) {
                el.style.setProperty('background-color', '#b91c1c', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('bg-black')) {
                el.style.setProperty('background-color', '#000000', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('bg-white')) {
                el.style.setProperty('background-color', '#ffffff', 'important');
                el.style.setProperty('color', '#000000', 'important');
              }
              
              if (el.classList.contains('text-white')) {
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('text-black')) {
                el.style.setProperty('color', '#000000', 'important');
              }
              
              if (el.classList.contains('text-red-700')) {
                el.style.setProperty('color', '#b91c1c', 'important');
              }
              
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
              }
            }
          });
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