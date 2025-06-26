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
      console.log('🎯 Starting EXACT layout preservation...');
      
      // Force browser to render everything properly
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Wait for complete rendering
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('📄 Found pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Force all images to load completely
      const allImages = content.querySelectorAll('img');
      console.log('🖼️ Loading images:', allImages.length);
      
      // Wait for all images to be fully loaded
      await Promise.all(Array.from(allImages).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => resolve(), 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          // Force reload if needed
          if (!img.complete) {
            const src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      }));

      // Additional wait for layout stabilization
      await new Promise(resolve => setTimeout(resolve, 3000));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page with maximum fidelity
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`🔧 Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is in viewport
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Force repaint
        page.style.transform = 'translateZ(0)';
        await new Promise(resolve => setTimeout(resolve, 500));
        page.style.transform = '';

        // Create canvas with maximum quality settings
        const canvas = await html2canvas(page, {
          scale: 4, // Maximum scale for highest quality
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false,
          imageTimeout: 15000,
          removeContainer: false,
          ignoreElements: (element) => {
            return element.classList?.contains('print:hidden') || false;
          },
          onclone: (clonedDoc, element) => {
            console.log('🎨 Applying exact styling...');
            
            // Remove any existing stylesheets that might interfere
            const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            existingStyles.forEach(style => style.remove());
            
            // Create comprehensive style sheet that matches exactly
            const masterStyle = clonedDoc.createElement('style');
            masterStyle.textContent = `
              /* Reset and base styles */
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
              }
              
              /* Exact layout preservation */
              .newsletter-page {
                width: 100% !important;
                height: 100vh !important;
                min-height: 100vh !important;
                position: relative !important;
                overflow: hidden !important;
              }
              
              /* Cover page styles */
              .newsletter-cover {
                background-color: #000000 !important;
                color: #ffffff !important;
                position: relative !important;
                height: 100vh !important;
                overflow: hidden !important;
              }
              
              .newsletter-cover .absolute {
                position: absolute !important;
              }
              
              .newsletter-cover .inset-0 {
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
              }
              
              .newsletter-cover .opacity-60 {
                opacity: 0.6 !important;
              }
              
              .newsletter-cover img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                filter: grayscale(100%) !important;
              }
              
              /* Red header box */
              .newsletter-cover .bg-red-700 {
                background-color: #b91c1c !important;
                color: #ffffff !important;
              }
              
              /* Typography */
              .text-8xl {
                font-size: 6rem !important;
                line-height: 1 !important;
                font-weight: 700 !important;
                color: #b91c1c !important;
              }
              
              .text-6xl {
                font-size: 3.75rem !important;
                line-height: 1 !important;
                font-weight: 700 !important;
              }
              
              .text-5xl {
                font-size: 3rem !important;
                line-height: 1 !important;
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
                font-weight: 500 !important;
              }
              
              .text-xl {
                font-size: 1.25rem !important;
                line-height: 1.75rem !important;
                font-weight: 500 !important;
              }
              
              .text-lg {
                font-size: 1.125rem !important;
                line-height: 1.75rem !important;
              }
              
              .text-sm {
                font-size: 0.875rem !important;
                line-height: 1.25rem !important;
              }
              
              .text-xs {
                font-size: 0.75rem !important;
                line-height: 1rem !important;
              }
              
              .font-bold {
                font-weight: 700 !important;
              }
              
              .font-semibold {
                font-weight: 600 !important;
              }
              
              .font-medium {
                font-weight: 500 !important;
              }
              
              .uppercase {
                text-transform: uppercase !important;
              }
              
              .italic {
                font-style: italic !important;
              }
              
              /* Colors */
              .text-white {
                color: #ffffff !important;
              }
              
              .text-black {
                color: #000000 !important;
              }
              
              .text-red-700 {
                color: #b91c1c !important;
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
              
              .bg-gray-50 {
                background-color: #f9fafb !important;
              }
              
              /* Layout */
              .flex {
                display: flex !important;
              }
              
              .relative {
                position: relative !important;
              }
              
              .absolute {
                position: absolute !important;
              }
              
              .min-h-screen {
                min-height: 100vh !important;
                height: 100vh !important;
              }
              
              .h-screen {
                height: 100vh !important;
              }
              
              .h-full {
                height: 100% !important;
              }
              
              .h-1\/3 {
                height: 33.333333% !important;
              }
              
              .h-2\/3 {
                height: 66.666667% !important;
              }
              
              .w-full {
                width: 100% !important;
              }
              
              .w-5\/12 {
                width: 41.666667% !important;
              }
              
              .w-7\/12 {
                width: 58.333333% !important;
              }
              
              .w-1\/2 {
                width: 50% !important;
              }
              
              /* Spacing */
              .p-8 {
                padding: 2rem !important;
              }
              
              .p-6 {
                padding: 1.5rem !important;
              }
              
              .p-5 {
                padding: 1.25rem !important;
              }
              
              .p-4 {
                padding: 1rem !important;
              }
              
              .py-2 {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
              }
              
              .px-4 {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
              }
              
              .px-2 {
                padding-left: 0.5rem !important;
                padding-right: 0.5rem !important;
              }
              
              .py-1 {
                padding-top: 0.25rem !important;
                padding-bottom: 0.25rem !important;
              }
              
              .ml-8 {
                margin-left: 2rem !important;
              }
              
              .mb-52 {
                margin-bottom: 13rem !important;
              }
              
              .mb-8 {
                margin-bottom: 2rem !important;
              }
              
              .mb-4 {
                margin-bottom: 1rem !important;
              }
              
              .mb-2 {
                margin-bottom: 0.5rem !important;
              }
              
              .mt-10 {
                margin-top: 2.5rem !important;
              }
              
              .mt-8 {
                margin-top: 2rem !important;
              }
              
              .mt-2 {
                margin-top: 0.5rem !important;
              }
              
              .mr-4 {
                margin-right: 1rem !important;
              }
              
              .mr-2 {
                margin-right: 0.5rem !important;
              }
              
              .-ml-4 {
                margin-left: -1rem !important;
              }
              
              /* Positioning */
              .top-0 {
                top: 0 !important;
              }
              
              .right-0 {
                right: 0 !important;
              }
              
              .bottom-0 {
                bottom: 0 !important;
              }
              
              .left-0 {
                left: 0 !important;
              }
              
              .top-8 {
                top: 2rem !important;
              }
              
              .left-8 {
                left: 2rem !important;
              }
              
              .inset-0 {
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
              }
              
              /* Flex properties */
              .flex-col {
                flex-direction: column !important;
              }
              
              .items-center {
                align-items: center !important;
              }
              
              .items-start {
                align-items: flex-start !important;
              }
              
              .items-end {
                align-items: flex-end !important;
              }
              
              .justify-between {
                justify-content: space-between !important;
              }
              
              .justify-center {
                justify-content: center !important;
              }
              
              /* Misc */
              .overflow-hidden {
                overflow: hidden !important;
              }
              
              .rounded-full {
                border-radius: 9999px !important;
              }
              
              .rounded-lg {
                border-radius: 0.5rem !important;
              }
              
              .leading-none {
                line-height: 1 !important;
              }
              
              .leading-tight {
                line-height: 1.25 !important;
              }
              
              .leading-relaxed {
                line-height: 1.625 !important;
              }
              
              .tracking-wider {
                letter-spacing: 0.05em !important;
              }
              
              .inline-block {
                display: inline-block !important;
              }
              
              .block {
                display: block !important;
              }
              
              .space-y-2 > * + * {
                margin-top: 0.5rem !important;
              }
              
              .space-y-4 > * + * {
                margin-top: 1rem !important;
              }
              
              .space-y-6 > * + * {
                margin-top: 1.5rem !important;
              }
              
              .space-y-8 > * + * {
                margin-top: 2rem !important;
              }
              
              .max-w-md {
                max-width: 28rem !important;
              }
              
              .z-10 {
                z-index: 10 !important;
              }
              
              .opacity-60 {
                opacity: 0.6 !important;
              }
              
              /* Image specific */
              img {
                display: block !important;
                object-fit: cover !important;
                filter: grayscale(100%) !important;
              }
              
              .grayscale {
                filter: grayscale(100%) !important;
              }
              
              /* Threats page specific */
              .newsletter-threats {
                background-color: #ffffff !important;
                color: #000000 !important;
                height: 100vh !important;
                display: flex !important;
              }
              
              /* Best practices page specific */
              .newsletter-best-practices {
                height: 100vh !important;
                display: flex !important;
              }
              
              /* Text shadows for cover */
              .newsletter-cover h1,
              .newsletter-cover h2 {
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3) !important;
              }
              
              /* Ensure proper stacking */
              .newsletter-cover > * {
                position: relative !important;
                z-index: 1 !important;
              }
              
              .newsletter-cover .absolute {
                z-index: 0 !important;
              }
              
              .newsletter-cover .z-10 {
                z-index: 10 !important;
              }
            `;
            
            clonedDoc.head.appendChild(masterStyle);
            
            // Force apply styles to all elements
            const allElements = element.querySelectorAll('*');
            allElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(el);
                
                // Copy critical layout properties
                const criticalProps = [
                  'position', 'top', 'left', 'right', 'bottom',
                  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
                  'margin', 'padding', 'border', 'background', 'color',
                  'font-family', 'font-size', 'font-weight', 'line-height',
                  'display', 'flex-direction', 'justify-content', 'align-items',
                  'z-index', 'opacity', 'overflow', 'transform'
                ];
                
                criticalProps.forEach(prop => {
                  const value = computedStyle.getPropertyValue(prop);
                  if (value && value !== 'initial' && value !== 'auto') {
                    el.style.setProperty(prop, value, 'important');
                  }
                });
                
                // Special handling for images
                if (el.tagName === 'IMG') {
                  const img = el as HTMLImageElement;
                  img.style.setProperty('object-fit', 'cover', 'important');
                  img.style.setProperty('filter', 'grayscale(100%)', 'important');
                  img.style.setProperty('width', '100%', 'important');
                  img.style.setProperty('height', '100%', 'important');
                }
              }
            });
            
            console.log('✅ Exact styling applied');
          }
        });

        console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`⚠️ Page ${i + 1} has zero dimensions`);
          continue;
        }

        // Add page to PDF
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate perfect fit for A4
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        
        // Scale to fit A4 while maintaining aspect ratio
        const canvasRatio = canvas.width / canvas.height;
        const pageRatio = pdfWidth / pdfHeight;
        
        let width, height, x, y;
        
        if (canvasRatio > pageRatio) {
          width = pdfWidth;
          height = pdfWidth / canvasRatio;
          x = 0;
          y = (pdfHeight - height) / 2;
        } else {
          height = pdfHeight;
          width = pdfHeight * canvasRatio;
          x = (pdfWidth - width) / 2;
          y = 0;
        }

        pdf.addImage(imgData, 'PNG', x, y, width, height, undefined, 'FAST');
        console.log(`✅ Page ${i + 1} added to PDF`);
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🎉 PDF generated with EXACT layout!');
      
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
      console.log('🎯 Starting EXACT PNG generation...');
      
      // Same preparation as PDF
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load all images
      const allImages = content.querySelectorAll('img');
      await Promise.all(Array.from(allImages).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => resolve(), 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Use EXACT same canvas settings as PDF
      const canvas = await html2canvas(content, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: (element) => {
          return element.classList?.contains('print:hidden') || false;
        },
        onclone: (clonedDoc, element) => {
          // Use EXACT same styling logic as PDF
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(style => style.remove());
          
          const masterStyle = clonedDoc.createElement('style');
          masterStyle.textContent = `
            * { box-sizing: border-box !important; }
            .bg-red-700 { background-color: #b91c1c !important; }
            .bg-black { background-color: #000000 !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            img { object-fit: cover !important; filter: grayscale(100%) !important; }
            .min-h-screen { min-height: 100vh !important; height: 100vh !important; }
            .flex { display: flex !important; }
            .relative { position: relative !important; }
            .absolute { position: absolute !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
          `;
          clonedDoc.head.appendChild(masterStyle);
        }
      });

      console.log(`📸 PNG canvas: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      // Download PNG
      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🎉 PNG generated with EXACT layout!');
      
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
              {/* 🎯 WRAPPED NEWSLETTER CONTENT - Everything under Newsletter Preview */}
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