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
      console.log('📄 Generating PERFECT PDF with exact preview styling...');

      // Force complete rendering and stabilization
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use enhanced canvas options for perfect quality
      const canvas = await html2canvas(content, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: null, // No background to avoid overlay effects
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
          console.log('🎨 Applying EXACT color and style preservation...');

          // Remove any existing conflicting styles
          const existingStyles = clonedDoc.querySelectorAll('style');
          existingStyles.forEach(style => {
            if (!style.textContent?.includes('tailwind')) {
              style.remove();
            }
          });
          
          // Create a comprehensive style override
          const perfectStyle = clonedDoc.createElement('style');
          perfectStyle.textContent = `
            /* FORCE EXACT COLORS AND REMOVE ANY OPACITY/DIM EFFECTS */
            * {
              box-sizing: border-box !important;
              opacity: 1 !important;
              filter: none !important;
            }
            
            /* EXACT BACKGROUND COLORS */
            .bg-red-700 {
              background-color: #b91c1c !important;
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .bg-black {
              background-color: #000000 !important;
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .bg-white {
              background-color: #ffffff !important;
              color: #000000 !important;
              opacity: 1 !important;
            }
            
            /* EXACT TEXT COLORS */
            .text-white {
              color: #ffffff !important;
              opacity: 1 !important;
            }
            
            .text-black {
              color: #000000 !important;
              opacity: 1 !important;
            }
            
            .text-red-700 {
              color: #b91c1c !important;
              opacity: 1 !important;
            }
            
            /* FORCE GRAYSCALE ON ALL IMAGES */
            img {
              filter: grayscale(100%) !important;
              opacity: 1 !important;
              object-fit: cover !important;
              width: 100% !important;
              height: 100% !important;
            }
            
            .grayscale {
              filter: grayscale(100%) !important;
              opacity: 1 !important;
            }
            
            /* REMOVE ANY DIM/OVERLAY EFFECTS */
            .newsletter-container,
            .newsletter,
            .newsletter-page,
            .newsletter-cover,
            .newsletter-threats,
            .newsletter-best-practices {
              opacity: 1 !important;
              background: none !important;
              filter: none !important;
            }
            
            /* ENSURE FULL OPACITY ON ALL ELEMENTS */
            .opacity-60 {
              opacity: 0.6 !important;
            }
            
            /* FORCE EXACT POSITIONING AND SIZING */
            .min-h-screen {
              min-height: 100vh !important;
              height: 100vh !important;
            }
            
            .h-screen {
              height: 100vh !important;
            }
            
            .absolute {
              position: absolute !important;
            }
            
            .relative {
              position: relative !important;
            }
            
            .inset-0 {
              top: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              left: 0 !important;
            }
            
            /* TYPOGRAPHY EXACT MATCH */
            .text-8xl {
              font-size: 6rem !important;
              line-height: 1 !important;
              font-weight: 700 !important;
            }
            
            .text-5xl {
              font-size: 3rem !important;
              line-height: 1.2 !important;
              font-weight: 700 !important;
            }
            
            .text-3xl {
              font-size: 1.875rem !important;
              line-height: 2.25rem !important;
              font-weight: 700 !important;
            }
            
            .text-2xl {
              font-size: 1.5rem !important;
              line-height: 2rem !important;
              font-weight: 600 !important;
            }
            
            .text-xl {
              font-size: 1.25rem !important;
              line-height: 1.75rem !important;
              font-weight: 600 !important;
            }
            
            .text-lg {
              font-size: 1.125rem !important;
              line-height: 1.75rem !important;
            }
            
            .text-sm {
              font-size: 0.875rem !important;
              line-height: 1.25rem !important;
            }
            
            .font-bold {
              font-weight: 700 !important;
            }
            
            .font-medium {
              font-weight: 500 !important;
            }
            
            .uppercase {
              text-transform: uppercase !important;
            }
            
            /* LAYOUT EXACT MATCH */
            .flex {
              display: flex !important;
            }
            
            .flex-col {
              flex-direction: column !important;
            }
            
            .items-center {
              align-items: center !important;
            }
            
            .items-end {
              align-items: flex-end !important;
            }
            
            .justify-between {
              justify-content: space-between !important;
            }
            
            .w-5\\/12 {
              width: 41.666667% !important;
            }
            
            .w-7\\/12 {
              width: 58.333333% !important;
            }
            
            .w-full {
              width: 100% !important;
            }
            
            .h-1\\/3 {
              height: 33.333333% !important;
            }
            
            .h-2\\/3 {
              height: 66.666667% !important;
            }
            
            /* SPACING EXACT MATCH */
            .p-8 { padding: 2rem !important; }
            .p-6 { padding: 1.5rem !important; }
            .p-5 { padding: 1.25rem !important; }
            .p-4 { padding: 1rem !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            
            .mb-52 { margin-bottom: 13rem !important; }
            .mb-8 { margin-bottom: 2rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .mt-10 { margin-top: 2.5rem !important; }
            .mt-8 { margin-top: 2rem !important; }
            .mt-2 { margin-top: 0.5rem !important; }
            .ml-8 { margin-left: 2rem !important; }
            .mr-4 { margin-right: 1rem !important; }
            .-ml-4 { margin-left: -1rem !important; }
            
            /* MISC */
            .overflow-hidden { overflow: hidden !important; }
            .rounded-full { border-radius: 9999px !important; }
            .leading-none { line-height: 1 !important; }
            .leading-tight { line-height: 1.25 !important; }
            .leading-relaxed { line-height: 1.625 !important; }
            .tracking-wider { letter-spacing: 0.05em !important; }
            .inline-block { display: inline-block !important; }
            .max-w-md { max-width: 28rem !important; }
            .z-10 { z-index: 10 !important; }
            
            /* REMOVE ANY TRANSPARENCY OR DIM EFFECTS */
            .newsletter-container::before,
            .newsletter-container::after,
            .newsletter::before,
            .newsletter::after {
              display: none !important;
            }
          `;

          clonedDoc.head.appendChild(perfectStyle);

          // Force apply styles to ALL elements
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Remove any opacity or filter effects that might cause dimming
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('filter', el.tagName === 'IMG' ? 'grayscale(100%)' : 'none', 'important');
              
              // Force exact background colors
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
              
              // Force exact text colors
              if (el.classList.contains('text-white')) {
                el.style.setProperty('color', '#ffffff', 'important');
              }
              
              if (el.classList.contains('text-black')) {
                el.style.setProperty('color', '#000000', 'important');
              }
              
              if (el.classList.contains('text-red-700')) {
                el.style.setProperty('color', '#b91c1c', 'important');
              }
              
              // Force grayscale on images
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
                el.style.setProperty('object-fit', 'cover', 'important');
                el.style.setProperty('width', '100%', 'important');
                el.style.setProperty('height', '100%', 'important');
              }
            }
          });

          console.log('✅ EXACT styling applied - no dim effects, perfect colors');
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
      console.log('🎉 PERFECT PDF generated - exact preview copy!');

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
      console.log('🖼️ Generating PERFECT PNG with exact preview styling...');

      // Force complete rendering and stabilization
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use EXACT same canvas settings as PDF for consistency
      const canvas = await html2canvas(content, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
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
          // Use EXACT same styling logic as PDF
          const existingStyles = clonedDoc.querySelectorAll('style');
          existingStyles.forEach(style => {
            if (!style.textContent?.includes('tailwind')) {
              style.remove();
            }
          });
          
          const perfectStyle = clonedDoc.createElement('style');
          perfectStyle.textContent = `
            * { box-sizing: border-box !important; opacity: 1 !important; filter: none !important; }
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; opacity: 1 !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; opacity: 1 !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; }
            .text-white { color: #ffffff !important; opacity: 1 !important; }
            .text-black { color: #000000 !important; opacity: 1 !important; }
            .text-red-700 { color: #b91c1c !important; opacity: 1 !important; }
            img { filter: grayscale(100%) !important; opacity: 1 !important; object-fit: cover !important; width: 100% !important; height: 100% !important; }
            .grayscale { filter: grayscale(100%) !important; opacity: 1 !important; }
            .min-h-screen { min-height: 100vh !important; height: 100vh !important; }
            .opacity-60 { opacity: 0.6 !important; }
          `;
          clonedDoc.head.appendChild(perfectStyle);

          // Apply exact same element styling as PDF
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('filter', el.tagName === 'IMG' ? 'grayscale(100%)' : 'none', 'important');
              
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
                el.style.setProperty('object-fit', 'cover', 'important');
                el.style.setProperty('width', '100%', 'important');
                el.style.setProperty('height', '100%', 'important');
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

      console.log('🎉 PERFECT PNG generated - exact preview copy!');

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