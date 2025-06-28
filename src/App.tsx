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
      console.log('📄 Generating PDF with maximum brightness and quality...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a completely isolated capture environment
      const canvas = await html2canvas(content, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff', // Force white background
        logging: false,
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
          console.log('🎨 Creating isolated bright theme environment...');
          
          // Remove ALL existing stylesheets to prevent interference
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(style => style.remove());
          
          // Create a COMPLETE style reset with maximum brightness
          const brightStyle = clonedDoc.createElement('style');
          brightStyle.textContent = `
            /* COMPLETE RESET AND BRIGHT THEME */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              opacity: 1 !important;
              filter: none !important;
              color-scheme: light !important;
            }
            
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            /* EXACT COLOR DEFINITIONS */
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
            
            .bg-gray-50 {
              background-color: #f9fafb !important;
              color: #000000 !important;
            }
            
            .bg-gray-100 {
              background-color: #f3f4f6 !important;
              color: #000000 !important;
            }
            
            /* TEXT COLORS */
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-red-800 { color: #991b1b !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            
            /* IMAGES - GRAYSCALE ONLY */
            img {
              filter: grayscale(100%) !important;
              opacity: 1 !important;
              object-fit: cover !important;
              width: 100% !important;
              height: 100% !important;
            }
            
            /* LAYOUT CLASSES */
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .h-1\\/3 { height: 33.333333% !important; }
            .h-2\\/3 { height: 66.666667% !important; }
            .w-5\\/12 { width: 41.666667% !important; }
            .w-7\\/12 { width: 58.333333% !important; }
            .w-1\\/2 { width: 50% !important; }
            .w-full { width: 100% !important; }
            
            /* FLEXBOX */
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .items-center { align-items: center !important; }
            .items-end { align-items: flex-end !important; }
            .items-start { align-items: flex-start !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-content: center !important; }
            
            /* POSITIONING */
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            .top-0 { top: 0 !important; }
            .right-0 { right: 0 !important; }
            .bottom-0 { bottom: 0 !important; }
            .left-0 { left: 0 !important; }
            .top-8 { top: 2rem !important; }
            .left-8 { left: 2rem !important; }
            .z-10 { z-index: 10 !important; }
            
            /* SPACING */
            .p-8 { padding: 2rem !important; }
            .p-6 { padding: 1.5rem !important; }
            .p-5 { padding: 1.25rem !important; }
            .p-4 { padding: 1rem !important; }
            .p-2 { padding: 0.5rem !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
            
            .mb-52 { margin-bottom: 13rem !important; }
            .mb-8 { margin-bottom: 2rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .mt-10 { margin-top: 2.5rem !important; }
            .mt-8 { margin-top: 2rem !important; }
            .mt-2 { margin-top: 0.5rem !important; }
            .mt-auto { margin-top: auto !important; }
            .ml-8 { margin-left: 2rem !important; }
            .mr-4 { margin-right: 1rem !important; }
            .mr-2 { margin-right: 0.5rem !important; }
            .-ml-4 { margin-left: -1rem !important; }
            .my-8 { margin-top: 2rem !important; margin-bottom: 2rem !important; }
            .max-w-md { max-width: 28rem !important; }
            
            /* TYPOGRAPHY */
            .text-8xl { font-size: 6rem !important; line-height: 1 !important; }
            .text-6xl { font-size: 3.75rem !important; line-height: 1 !important; }
            .text-5xl { font-size: 3rem !important; line-height: 1.2 !important; }
            .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
            .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-medium { font-weight: 500 !important; }
            .uppercase { text-transform: uppercase !important; }
            .italic { font-style: italic !important; }
            
            .leading-none { line-height: 1 !important; }
            .leading-tight { line-height: 1.25 !important; }
            .leading-relaxed { line-height: 1.625 !important; }
            .tracking-wider { letter-spacing: 0.05em !important; }
            
            /* MISC */
            .overflow-hidden { overflow: hidden !important; }
            .rounded-lg { border-radius: 0.5rem !important; }
            .rounded-full { border-radius: 9999px !important; }
            .rounded { border-radius: 0.25rem !important; }
            .inline-block { display: inline-block !important; }
            .block { display: block !important; }
            .space-y-4 > * + * { margin-top: 1rem !important; }
            .space-y-6 > * + * { margin-top: 1.5rem !important; }
            .space-y-8 > * + * { margin-top: 2rem !important; }
            .space-x-2 > * + * { margin-left: 0.5rem !important; }
            .space-x-4 > * + * { margin-left: 1rem !important; }
            
            /* OPACITY */
            .opacity-60 { opacity: 0.6 !important; }
            
            /* BORDERS */
            .border { border-width: 1px !important; border-color: #d1d5db !important; }
            .border-l-4 { border-left-width: 4px !important; }
            .border-red-600 { border-color: #dc2626 !important; }
            .border-red-200 { border-color: #fecaca !important; }
            .border-red-300 { border-color: #fca5a5 !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .border-gray-300 { border-color: #d1d5db !important; }
            
            /* GRID */
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .gap-4 { gap: 1rem !important; }
            
            /* SPECIAL BACKGROUND COLORS */
            .bg-red-100 { background-color: #fee2e2 !important; color: #000000 !important; }
            .bg-orange-100 { background-color: #ffedd5 !important; color: #000000 !important; }
            .bg-yellow-100 { background-color: #fef3c7 !important; color: #000000 !important; }
            .bg-green-100 { background-color: #dcfce7 !important; color: #000000 !important; }
            .bg-blue-100 { background-color: #dbeafe !important; color: #000000 !important; }
            
            .text-red-800 { color: #991b1b !important; }
            .text-orange-800 { color: #9a3412 !important; }
            .text-yellow-800 { color: #92400e !important; }
            .text-green-800 { color: #166534 !important; }
            .text-blue-800 { color: #1e40af !important; }
          `;
          
          clonedDoc.head.appendChild(brightStyle);
          
          // Force apply styles to every single element
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              // Remove any dark theme interference
              el.style.removeProperty('color-scheme');
              el.style.setProperty('opacity', '1', 'important');
              
              // Apply bright colors based on classes
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
              
              // Force grayscale on images only
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
                el.style.setProperty('opacity', '1', 'important');
              }
            }
          });
          
          console.log('✅ Bright isolated environment created');
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
      console.log('🎉 Bright PDF generated successfully!');

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
      console.log('🖼️ Generating bright PNG...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use exact same approach as PDF for consistency
      const canvas = await html2canvas(content, {
        scale: 3,
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
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          // Use exact same styling as PDF
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(style => style.remove());
          
          const brightStyle = clonedDoc.createElement('style');
          brightStyle.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; opacity: 1 !important; filter: none !important; color-scheme: light !important; }
            html, body { background-color: #ffffff !important; color: #000000 !important; font-family: 'Inter', sans-serif !important; }
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            img { filter: grayscale(100%) !important; opacity: 1 !important; object-fit: cover !important; width: 100% !important; height: 100% !important; }
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .flex { display: flex !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
          `;
          clonedDoc.head.appendChild(brightStyle);
          
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.removeProperty('color-scheme');
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
              
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
                el.style.setProperty('opacity', '1', 'important');
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

      console.log('🎉 Bright PNG generated successfully!');

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