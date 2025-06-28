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
      console.log('📄 Generating PDF with proper text rendering...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          console.log('🎨 Applying comprehensive styling fixes...');
          
          // COMPREHENSIVE STYLE FIXES
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
            /* FORCE LIGHT THEME AND REMOVE DARK MODE */
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              color-scheme: light !important;
            }
            
            /* FORCE EXACT NEWSLETTER COLORS WITH HIGH SPECIFICITY */
            .bg-red-700,
            div.bg-red-700,
            .newsletter .bg-red-700,
            .newsletter-container .bg-red-700 {
              background-color: #b91c1c !important;
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .bg-black,
            div.bg-black,
            .newsletter .bg-black,
            .newsletter-container .bg-black {
              background-color: #000000 !important;
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .bg-white,
            div.bg-white,
            .newsletter .bg-white,
            .newsletter-container .bg-white {
              background-color: #ffffff !important;
              color: #000000 !important;
              opacity: 1 !important;
            }
            
            /* FORCE TEXT COLORS WITH HIGH SPECIFICITY */
            .text-white,
            h1.text-white,
            h2.text-white,
            h3.text-white,
            p.text-white,
            span.text-white,
            div.text-white,
            .newsletter .text-white,
            .newsletter-container .text-white {
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .text-black,
            .newsletter .text-black,
            .newsletter-container .text-black {
              color: #000000 !important;
              opacity: 1 !important;
            }
            
            .text-red-700,
            .newsletter .text-red-700,
            .newsletter-container .text-red-700 {
              color: #b91c1c !important;
              opacity: 1 !important;
            }
            
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            
            /* FORCE GRAYSCALE ON ALL IMAGES */
            img,
            .newsletter img,
            .newsletter-container img {
              filter: grayscale(100%) !important;
              -webkit-filter: grayscale(100%) !important;
              -moz-filter: grayscale(100%) !important;
              -ms-filter: grayscale(100%) !important;
              -o-filter: grayscale(100%) !important;
              opacity: 1 !important;
            }
            
            /* LAYOUT FIXES */
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            
            /* ENSURE NEWSLETTER CONTAINER IS PROPERLY STYLED */
            .newsletter-container,
            .newsletter,
            .newsletter-page {
              background-color: #ffffff !important;
              opacity: 1 !important;
            }
            
            /* OPACITY CLASSES */
            .opacity-60 { opacity: 0.6 !important; }
            
            /* FORCE INLINE-BLOCK ELEMENTS TO RENDER PROPERLY */
            .inline-block {
              display: inline-block !important;
              opacity: 1 !important;
            }
            
            /* ENSURE ALL ELEMENTS ARE VISIBLE */
            * {
              opacity: 1 !important;
              visibility: visible !important;
            }
            
            /* SPECIFIC FIX FOR RED BOX WITH WHITE TEXT */
            .bg-red-700.inline-block,
            .bg-red-700 h3,
            .bg-red-700 .text-lg {
              background-color: #b91c1c !important;
              color: #ffffff !important;
              opacity: 1 !important;
              visibility: visible !important;
              display: inline-block !important;
            }
          `;
          
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          // FORCE STYLES ON ALL ELEMENTS DIRECTLY
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Remove any dark theme properties
              el.style.removeProperty('color-scheme');
              
              // Force visibility
              el.style.setProperty('visibility', 'visible', 'important');
              el.style.setProperty('opacity', '1', 'important');
              
              // Apply specific color fixes based on classes
              if (el.classList.contains('bg-red-700')) {
                el.style.setProperty('background-color', '#b91c1c', 'important');
                el.style.setProperty('color', '#ffffff', 'important');
                console.log('Fixed red background element:', el.textContent?.substring(0, 50));
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
              
              // Special handling for inline-block elements
              if (el.classList.contains('inline-block')) {
                el.style.setProperty('display', 'inline-block', 'important');
                el.style.setProperty('visibility', 'visible', 'important');
                el.style.setProperty('opacity', '1', 'important');
              }
            }
          });
          
          // FORCE GRAYSCALE ON ALL IMAGES
          const allImages = element.querySelectorAll('img');
          allImages.forEach((img) => {
            if (img instanceof HTMLElement) {
              img.style.setProperty('filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-webkit-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-moz-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-ms-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-o-filter', 'grayscale(100%)', 'important');
              img.setAttribute('style', (img.getAttribute('style') || '') + '; filter: grayscale(100%) !important;');
            }
          });
          
          console.log(`✅ Applied comprehensive fixes to ${allElements.length} elements and ${allImages.length} images`);
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
      console.log('🎉 PDF generated with proper text rendering!');

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
      console.log('🖼️ Generating PNG with proper text rendering...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use same comprehensive approach as PDF
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          // Same comprehensive styling as PDF
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
            html, body { background-color: #ffffff !important; color: #000000 !important; color-scheme: light !important; }
            .bg-red-700, div.bg-red-700, .newsletter .bg-red-700, .newsletter-container .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; opacity: 1 !important; }
            .bg-black, div.bg-black, .newsletter .bg-black, .newsletter-container .bg-black { background-color: #000000 !important; color: #ffffff !important; opacity: 1 !important; }
            .bg-white, div.bg-white, .newsletter .bg-white, .newsletter-container .bg-white { background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; }
            .text-white, h1.text-white, h2.text-white, h3.text-white, p.text-white, span.text-white, div.text-white, .newsletter .text-white, .newsletter-container .text-white { color: #ffffff !important; opacity: 1 !important; }
            .text-black, .newsletter .text-black, .newsletter-container .text-black { color: #000000 !important; opacity: 1 !important; }
            .text-red-700, .newsletter .text-red-700, .newsletter-container .text-red-700 { color: #b91c1c !important; opacity: 1 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            img, .newsletter img, .newsletter-container img { filter: grayscale(100%) !important; -webkit-filter: grayscale(100%) !important; -moz-filter: grayscale(100%) !important; -ms-filter: grayscale(100%) !important; -o-filter: grayscale(100%) !important; opacity: 1 !important; }
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .newsletter-container, .newsletter, .newsletter-page { background-color: #ffffff !important; opacity: 1 !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .inline-block { display: inline-block !important; opacity: 1 !important; }
            * { opacity: 1 !important; visibility: visible !important; }
            .bg-red-700.inline-block, .bg-red-700 h3, .bg-red-700 .text-lg { background-color: #b91c1c !important; color: #ffffff !important; opacity: 1 !important; visibility: visible !important; display: inline-block !important; }
          `;
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          // Apply same element fixes as PDF
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.removeProperty('color-scheme');
              el.style.setProperty('visibility', 'visible', 'important');
              el.style.setProperty('opacity', '1', 'important');
              
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
              
              if (el.classList.contains('inline-block')) {
                el.style.setProperty('display', 'inline-block', 'important');
                el.style.setProperty('visibility', 'visible', 'important');
                el.style.setProperty('opacity', '1', 'important');
              }
            }
          });
          
          // Apply same image fixes as PDF
          const allImages = element.querySelectorAll('img');
          allImages.forEach((img) => {
            if (img instanceof HTMLElement) {
              img.style.setProperty('filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-webkit-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-moz-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-ms-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-o-filter', 'grayscale(100%)', 'important');
              img.setAttribute('style', (img.getAttribute('style') || '') + '; filter: grayscale(100%) !important;');
            }
          });
          
          console.log(`✅ Applied comprehensive fixes to ${allElements.length} elements and ${allImages.length} images`);
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

      console.log('🎉 PNG generated with proper text rendering!');

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