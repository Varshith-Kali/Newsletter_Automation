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
      console.log('📄 Generating PDF with grayscale images and fixed text...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force light theme and capture
      const canvas = await html2canvas(content, {
        scale: 2,
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
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          console.log('🎨 Applying grayscale to all images and fixing text rendering...');
          
          // COMPREHENSIVE STYLE INJECTION
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
            /* FORCE LIGHT THEME */
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
            
            /* FORCE GRAYSCALE ON ALL IMAGES */
            img {
              filter: grayscale(100%) !important;
              -webkit-filter: grayscale(100%) !important;
              opacity: 1 !important;
            }
            
            /* LAYOUT */
            .min-h-screen {
              min-height: 100vh !important;
            }
            
            .h-screen {
              height: 100vh !important;
            }
            
            /* ENSURE ABSOLUTE POSITIONING WORKS */
            .absolute {
              position: absolute !important;
            }
            
            .relative {
              position: relative !important;
            }
            
            /* ENSURE Z-INDEX WORKS */
            .z-10 {
              z-index: 10 !important;
            }
            
            .z-20 {
              z-index: 20 !important;
            }
            
            /* ENSURE POSITIONING VALUES */
            .top-8 {
              top: 2rem !important;
            }
            
            .left-8 {
              left: 2rem !important;
            }
            
            .right-0 {
              right: 0 !important;
            }
            
            .top-0 {
              top: 0 !important;
            }
            
            .bottom-0 {
              bottom: 0 !important;
            }
            
            .inset-0 {
              top: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              left: 0 !important;
            }
            
            /* ENSURE MAX-WIDTH WORKS */
            .max-w-md {
              max-width: 28rem !important;
            }
            
            /* ENSURE INLINE-BLOCK WORKS */
            .inline-block {
              display: inline-block !important;
            }
            
            /* ENSURE PADDING WORKS */
            .py-2 {
              padding-top: 0.5rem !important;
              padding-bottom: 0.5rem !important;
            }
            
            .px-4 {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
            
            .mt-10 {
              margin-top: 2.5rem !important;
            }
            
            /* ENSURE TEXT SIZING WORKS */
            .text-lg {
              font-size: 1.125rem !important;
              line-height: 1.75rem !important;
            }
            
            .font-medium {
              font-weight: 500 !important;
            }
            
            /* FORCE TEXT VISIBILITY IN RED BOXES */
            .bg-red-700 h3,
            .bg-red-700 .text-white,
            .bg-red-700 * {
              color: #ffffff !important;
              opacity: 1 !important;
              visibility: visible !important;
              display: block !important;
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
            
            /* ENSURE WHITE SPACE HANDLING */
            .whitespace-nowrap {
              white-space: nowrap !important;
            }
          `;
          
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          // FORCE GRAYSCALE ON ALL IMAGES DIRECTLY
          const allImages = element.querySelectorAll('img');
          allImages.forEach((img) => {
            if (img instanceof HTMLElement) {
              // Apply multiple grayscale methods to ensure it works
              img.style.setProperty('filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-webkit-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-moz-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-ms-filter', 'grayscale(100%)', 'important');
              img.style.setProperty('-o-filter', 'grayscale(100%)', 'important');
              
              // Also try setting the attribute
              img.setAttribute('style', (img.getAttribute('style') || '') + '; filter: grayscale(100%) !important;');
              
              console.log('Applied grayscale to image:', img.src);
            }
          });
          
          // SPECIFICALLY FIX THE PROBLEMATIC TEXT ELEMENT
          const redBoxes = element.querySelectorAll('.bg-red-700');
          redBoxes.forEach((box) => {
            if (box instanceof HTMLElement) {
              // Force red background and white text
              box.style.setProperty('background-color', '#b91c1c', 'important');
              box.style.setProperty('color', '#ffffff', 'important');
              
              // Find all text elements inside and force white color
              const textElements = box.querySelectorAll('*');
              textElements.forEach((textEl) => {
                if (textEl instanceof HTMLElement) {
                  textEl.style.setProperty('color', '#ffffff', 'important');
                  textEl.style.setProperty('opacity', '1', 'important');
                  textEl.style.setProperty('visibility', 'visible', 'important');
                  textEl.style.setProperty('display', 'block', 'important');
                  
                  // If it's the specific h3 element, ensure it's visible
                  if (textEl.tagName === 'H3') {
                    textEl.style.setProperty('font-size', '1.125rem', 'important');
                    textEl.style.setProperty('font-weight', '500', 'important');
                    textEl.style.setProperty('line-height', '1.75rem', 'important');
                    textEl.style.setProperty('white-space', 'nowrap', 'important');
                  }
                }
              });
            }
          });
          
          // Force styles on all other elements
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.tagName !== 'IMG') {
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
              
              // Fix absolute positioning
              if (el.classList.contains('absolute')) {
                el.style.setProperty('position', 'absolute', 'important');
              }
              
              if (el.classList.contains('relative')) {
                el.style.setProperty('position', 'relative', 'important');
              }
              
              // Fix z-index
              if (el.classList.contains('z-10')) {
                el.style.setProperty('z-index', '10', 'important');
              }
              
              if (el.classList.contains('z-20')) {
                el.style.setProperty('z-index', '20', 'important');
              }
              
              // Fix positioning values
              if (el.classList.contains('top-8')) {
                el.style.setProperty('top', '2rem', 'important');
              }
              
              if (el.classList.contains('left-8')) {
                el.style.setProperty('left', '2rem', 'important');
              }
              
              if (el.classList.contains('right-0')) {
                el.style.setProperty('right', '0', 'important');
              }
              
              if (el.classList.contains('top-0')) {
                el.style.setProperty('top', '0', 'important');
              }
              
              if (el.classList.contains('bottom-0')) {
                el.style.setProperty('bottom', '0', 'important');
              }
              
              if (el.classList.contains('inset-0')) {
                el.style.setProperty('top', '0', 'important');
                el.style.setProperty('right', '0', 'important');
                el.style.setProperty('bottom', '0', 'important');
                el.style.setProperty('left', '0', 'important');
              }
              
              // Fix max-width
              if (el.classList.contains('max-w-md')) {
                el.style.setProperty('max-width', '28rem', 'important');
              }
              
              // Fix inline-block
              if (el.classList.contains('inline-block')) {
                el.style.setProperty('display', 'inline-block', 'important');
              }
              
              // Fix padding
              if (el.classList.contains('py-2')) {
                el.style.setProperty('padding-top', '0.5rem', 'important');
                el.style.setProperty('padding-bottom', '0.5rem', 'important');
              }
              
              if (el.classList.contains('px-4')) {
                el.style.setProperty('padding-left', '1rem', 'important');
                el.style.setProperty('padding-right', '1rem', 'important');
              }
              
              if (el.classList.contains('mt-10')) {
                el.style.setProperty('margin-top', '2.5rem', 'important');
              }
              
              // Fix text sizing
              if (el.classList.contains('text-lg')) {
                el.style.setProperty('font-size', '1.125rem', 'important');
                el.style.setProperty('line-height', '1.75rem', 'important');
              }
              
              if (el.classList.contains('font-medium')) {
                el.style.setProperty('font-weight', '500', 'important');
              }
            }
          });
          
          console.log(`✅ Applied grayscale to ${allImages.length} images and fixed text rendering`);
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
      console.log('🎉 PDF generated with grayscale images and fixed text!');

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
      console.log('🖼️ Generating PNG with grayscale images and fixed text...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use same comprehensive approach as PDF
      const canvas = await html2canvas(content, {
        scale: 2,
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
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          // Same comprehensive styling as PDF
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
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
            img { 
              filter: grayscale(100%) !important; 
              -webkit-filter: grayscale(100%) !important;
              opacity: 1 !important; 
            }
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .z-10 { z-index: 10 !important; }
            .z-20 { z-index: 20 !important; }
            .top-8 { top: 2rem !important; }
            .left-8 { left: 2rem !important; }
            .right-0 { right: 0 !important; }
            .top-0 { top: 0 !important; }
            .bottom-0 { bottom: 0 !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            .max-w-md { max-width: 28rem !important; }
            .inline-block { display: inline-block !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .mt-10 { margin-top: 2.5rem !important; }
            .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .font-medium { font-weight: 500 !important; }
            .bg-red-700 h3, .bg-red-700 .text-white, .bg-red-700 * { 
              color: #ffffff !important; 
              opacity: 1 !important; 
              visibility: visible !important; 
              display: block !important; 
            }
            * { opacity: 1 !important; }
            .newsletter-container, .newsletter, .newsletter-page { background-color: #ffffff !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .whitespace-nowrap { white-space: nowrap !important; }
          `;
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          // Same image and element processing as PDF
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
          
          // Same red box text fixing as PDF
          const redBoxes = element.querySelectorAll('.bg-red-700');
          redBoxes.forEach((box) => {
            if (box instanceof HTMLElement) {
              box.style.setProperty('background-color', '#b91c1c', 'important');
              box.style.setProperty('color', '#ffffff', 'important');
              
              const textElements = box.querySelectorAll('*');
              textElements.forEach((textEl) => {
                if (textEl instanceof HTMLElement) {
                  textEl.style.setProperty('color', '#ffffff', 'important');
                  textEl.style.setProperty('opacity', '1', 'important');
                  textEl.style.setProperty('visibility', 'visible', 'important');
                  textEl.style.setProperty('display', 'block', 'important');
                  
                  if (textEl.tagName === 'H3') {
                    textEl.style.setProperty('font-size', '1.125rem', 'important');
                    textEl.style.setProperty('font-weight', '500', 'important');
                    textEl.style.setProperty('line-height', '1.75rem', 'important');
                    textEl.style.setProperty('white-space', 'nowrap', 'important');
                  }
                }
              });
            }
          });
          
          // Same comprehensive element styling as PDF
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.tagName !== 'IMG') {
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
              
              // All the same positioning and styling fixes as PDF...
              if (el.classList.contains('absolute')) {
                el.style.setProperty('position', 'absolute', 'important');
              }
              
              if (el.classList.contains('relative')) {
                el.style.setProperty('position', 'relative', 'important');
              }
              
              if (el.classList.contains('z-10')) {
                el.style.setProperty('z-index', '10', 'important');
              }
              
              if (el.classList.contains('z-20')) {
                el.style.setProperty('z-index', '20', 'important');
              }
              
              if (el.classList.contains('top-8')) {
                el.style.setProperty('top', '2rem', 'important');
              }
              
              if (el.classList.contains('left-8')) {
                el.style.setProperty('left', '2rem', 'important');
              }
              
              if (el.classList.contains('right-0')) {
                el.style.setProperty('right', '0', 'important');
              }
              
              if (el.classList.contains('top-0')) {
                el.style.setProperty('top', '0', 'important');
              }
              
              if (el.classList.contains('bottom-0')) {
                el.style.setProperty('bottom', '0', 'important');
              }
              
              if (el.classList.contains('inset-0')) {
                el.style.setProperty('top', '0', 'important');
                el.style.setProperty('right', '0', 'important');
                el.style.setProperty('bottom', '0', 'important');
                el.style.setProperty('left', '0', 'important');
              }
              
              if (el.classList.contains('max-w-md')) {
                el.style.setProperty('max-width', '28rem', 'important');
              }
              
              if (el.classList.contains('inline-block')) {
                el.style.setProperty('display', 'inline-block', 'important');
              }
              
              if (el.classList.contains('py-2')) {
                el.style.setProperty('padding-top', '0.5rem', 'important');
                el.style.setProperty('padding-bottom', '0.5rem', 'important');
              }
              
              if (el.classList.contains('px-4')) {
                el.style.setProperty('padding-left', '1rem', 'important');
                el.style.setProperty('padding-right', '1rem', 'important');
              }
              
              if (el.classList.contains('mt-10')) {
                el.style.setProperty('margin-top', '2.5rem', 'important');
              }
              
              if (el.classList.contains('text-lg')) {
                el.style.setProperty('font-size', '1.125rem', 'important');
                el.style.setProperty('line-height', '1.75rem', 'important');
              }
              
              if (el.classList.contains('font-medium')) {
                el.style.setProperty('font-weight', '500', 'important');
              }
            }
          });
          
          console.log(`✅ Applied grayscale to ${allImages.length} images and fixed text rendering`);
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

      console.log('🎉 PNG generated with grayscale images and fixed text!');

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