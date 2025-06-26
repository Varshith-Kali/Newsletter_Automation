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
      console.log('🎯 Starting PERFECT PDF generation...');
      
      // Force complete rendering
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Wait for complete layout stabilization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Force all images to load
      const allImages = content.querySelectorAll('img');
      console.log('🖼️ Ensuring all images are loaded:', allImages.length);
      
      await Promise.all(Array.from(allImages).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => resolve(), 15000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          // Force reload
          const src = img.src;
          img.src = '';
          img.src = src;
        });
      }));

      // Additional stabilization
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('📄 Processing pages:', pages.length);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`🔧 Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is visible and stable
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Force layout recalculation
        page.style.transform = 'translateZ(0)';
        await new Promise(resolve => setTimeout(resolve, 500));
        page.style.transform = '';

        // Create canvas with MAXIMUM quality and exact styling
        const canvas = await html2canvas(page, {
          scale: 3, // High quality
          useCORS: true,
          allowTaint: false,
          backgroundColor: null, // Preserve transparency
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: true, // Better text rendering
          imageTimeout: 20000,
          removeContainer: false,
          ignoreElements: (element) => {
            // Don't ignore any elements - capture everything
            return false;
          },
          onclone: (clonedDoc, element) => {
            console.log('🎨 Applying EXACT styling preservation...');
            
            // Remove any conflicting styles
            const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            existingStyles.forEach(style => {
              if (!style.textContent?.includes('tailwind') && !style.textContent?.includes('index.css')) {
                style.remove();
              }
            });
            
            // Create master style that EXACTLY matches the preview
            const exactStyle = clonedDoc.createElement('style');
            exactStyle.textContent = `
              /* EXACT PREVIEW REPLICATION */
              * {
                box-sizing: border-box !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
              }
              
              /* Newsletter container */
              .newsletter-page {
                width: 100% !important;
                height: 100vh !important;
                min-height: 100vh !important;
                position: relative !important;
                overflow: hidden !important;
                display: block !important;
              }
              
              /* Cover page - BLACK background with RED accents */
              .newsletter-cover {
                background-color: #000000 !important;
                color: #ffffff !important;
                position: relative !important;
                height: 100vh !important;
                min-height: 100vh !important;
                overflow: hidden !important;
              }
              
              /* Cover page images - GRAYSCALE */
              .newsletter-cover img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                filter: grayscale(100%) !important;
                display: block !important;
              }
              
              /* RED header box */
              .bg-red-700 {
                background-color: #b91c1c !important;
                color: #ffffff !important;
              }
              
              /* BLACK background */
              .bg-black {
                background-color: #000000 !important;
                color: #ffffff !important;
              }
              
              /* WHITE background */
              .bg-white {
                background-color: #ffffff !important;
                color: #000000 !important;
              }
              
              /* Text colors */
              .text-white {
                color: #ffffff !important;
              }
              
              .text-black {
                color: #000000 !important;
              }
              
              .text-red-700 {
                color: #b91c1c !important;
              }
              
              /* Typography - EXACT sizes */
              .text-8xl {
                font-size: 6rem !important;
                line-height: 1 !important;
                font-weight: 700 !important;
              }
              
              .text-6xl {
                font-size: 3.75rem !important;
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
              
              .text-xs {
                font-size: 0.75rem !important;
                line-height: 1rem !important;
              }
              
              /* Font weights */
              .font-bold {
                font-weight: 700 !important;
              }
              
              .font-semibold {
                font-weight: 600 !important;
              }
              
              .font-medium {
                font-weight: 500 !important;
              }
              
              /* Text transforms */
              .uppercase {
                text-transform: uppercase !important;
              }
              
              .italic {
                font-style: italic !important;
              }
              
              /* Layout */
              .flex {
                display: flex !important;
              }
              
              .flex-col {
                flex-direction: column !important;
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
              
              .h-1\\/3 {
                height: 33.333333% !important;
              }
              
              .h-2\\/3 {
                height: 66.666667% !important;
              }
              
              .w-full {
                width: 100% !important;
              }
              
              .w-5\\/12 {
                width: 41.666667% !important;
              }
              
              .w-7\\/12 {
                width: 58.333333% !important;
              }
              
              .w-1\\/2 {
                width: 50% !important;
              }
              
              /* Positioning */
              .inset-0 {
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
              }
              
              .top-0 { top: 0 !important; }
              .right-0 { right: 0 !important; }
              .bottom-0 { bottom: 0 !important; }
              .left-0 { left: 0 !important; }
              .top-8 { top: 2rem !important; }
              .left-8 { left: 2rem !important; }
              
              /* Spacing */
              .p-8 { padding: 2rem !important; }
              .p-6 { padding: 1.5rem !important; }
              .p-5 { padding: 1.25rem !important; }
              .p-4 { padding: 1rem !important; }
              .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
              .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
              .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
              .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
              
              .ml-8 { margin-left: 2rem !important; }
              .mb-52 { margin-bottom: 13rem !important; }
              .mb-8 { margin-bottom: 2rem !important; }
              .mb-4 { margin-bottom: 1rem !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mt-10 { margin-top: 2.5rem !important; }
              .mt-8 { margin-top: 2rem !important; }
              .mt-2 { margin-top: 0.5rem !important; }
              .mr-4 { margin-right: 1rem !important; }
              .mr-2 { margin-right: 0.5rem !important; }
              .-ml-4 { margin-left: -1rem !important; }
              
              /* Flex alignment */
              .items-center { align-items: center !important; }
              .items-start { align-items: flex-start !important; }
              .items-end { align-items: flex-end !important; }
              .justify-between { justify-content: space-between !important; }
              .justify-center { justify-content: center !important; }
              
              /* Misc */
              .overflow-hidden { overflow: hidden !important; }
              .rounded-full { border-radius: 9999px !important; }
              .rounded-lg { border-radius: 0.5rem !important; }
              .leading-none { line-height: 1 !important; }
              .leading-tight { line-height: 1.25 !important; }
              .leading-relaxed { line-height: 1.625 !important; }
              .tracking-wider { letter-spacing: 0.05em !important; }
              .inline-block { display: inline-block !important; }
              .block { display: block !important; }
              .max-w-md { max-width: 28rem !important; }
              .z-10 { z-index: 10 !important; }
              .opacity-60 { opacity: 0.6 !important; }
              
              /* Spacing utilities */
              .space-y-2 > * + * { margin-top: 0.5rem !important; }
              .space-y-4 > * + * { margin-top: 1rem !important; }
              .space-y-6 > * + * { margin-top: 1.5rem !important; }
              .space-y-8 > * + * { margin-top: 2rem !important; }
              
              /* CRITICAL: All images MUST be grayscale */
              img {
                filter: grayscale(100%) !important;
                object-fit: cover !important;
                display: block !important;
                width: 100% !important;
                height: 100% !important;
              }
              
              .grayscale {
                filter: grayscale(100%) !important;
              }
              
              /* Text shadows for cover page */
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
              
              /* Page-specific styles */
              .newsletter-threats {
                background-color: #ffffff !important;
                color: #000000 !important;
                height: 100vh !important;
                display: flex !important;
              }
              
              .newsletter-best-practices {
                height: 100vh !important;
                display: flex !important;
              }
            `;
            
            clonedDoc.head.appendChild(exactStyle);
            
            // Force apply computed styles to ALL elements
            const allElements = element.querySelectorAll('*');
            allElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(el);
                
                // Copy ALL critical properties
                const criticalProps = [
                  'position', 'top', 'left', 'right', 'bottom',
                  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
                  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
                  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
                  'border', 'background', 'background-color', 'color',
                  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
                  'display', 'flex-direction', 'justify-content', 'align-items', 'flex',
                  'z-index', 'opacity', 'overflow', 'transform', 'text-transform',
                  'border-radius', 'box-sizing', 'object-fit', 'filter'
                ];
                
                criticalProps.forEach(prop => {
                  const value = computedStyle.getPropertyValue(prop);
                  if (value && value !== 'initial' && value !== 'auto' && value !== 'normal') {
                    el.style.setProperty(prop, value, 'important');
                  }
                });
                
                // Special handling for images - FORCE grayscale
                if (el.tagName === 'IMG') {
                  el.style.setProperty('filter', 'grayscale(100%)', 'important');
                  el.style.setProperty('object-fit', 'cover', 'important');
                  el.style.setProperty('width', '100%', 'important');
                  el.style.setProperty('height', '100%', 'important');
                }
                
                // Special handling for backgrounds
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
                
                // Force text colors
                if (el.classList.contains('text-red-700')) {
                  el.style.setProperty('color', '#b91c1c', 'important');
                }
                
                if (el.classList.contains('text-white')) {
                  el.style.setProperty('color', '#ffffff', 'important');
                }
                
                if (el.classList.contains('text-black')) {
                  el.style.setProperty('color', '#000000', 'important');
                }
              }
            });
            
            console.log('✅ EXACT styling applied to all elements');
          }
        });

        console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`⚠️ Page ${i + 1} has zero dimensions, skipping`);
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
        
        // Scale to fit A4 perfectly
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
        console.log(`✅ Page ${i + 1} added to PDF with perfect dimensions`);
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🎉 PERFECT PDF generated with EXACT preview copy!');
      
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
      console.log('🎯 Starting PERFECT PNG generation...');
      
      // Same preparation as PDF
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Load all images
      const allImages = content.querySelectorAll('img');
      await Promise.all(Array.from(allImages).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => resolve(), 15000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
          
          const src = img.src;
          img.src = '';
          img.src = src;
        });
      }));

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
        foreignObjectRendering: true,
        imageTimeout: 20000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          // Use EXACT same styling logic as PDF
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(style => {
            if (!style.textContent?.includes('tailwind') && !style.textContent?.includes('index.css')) {
              style.remove();
            }
          });
          
          const exactStyle = clonedDoc.createElement('style');
          exactStyle.textContent = `
            * { box-sizing: border-box !important; }
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            img { filter: grayscale(100%) !important; object-fit: cover !important; width: 100% !important; height: 100% !important; }
            .min-h-screen { min-height: 100vh !important; height: 100vh !important; }
            .flex { display: flex !important; }
            .relative { position: relative !important; }
            .absolute { position: absolute !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            .newsletter-page { width: 100% !important; height: 100vh !important; overflow: hidden !important; }
          `;
          clonedDoc.head.appendChild(exactStyle);
          
          // Apply exact same element styling as PDF
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              
              const criticalProps = [
                'position', 'top', 'left', 'right', 'bottom',
                'width', 'height', 'background-color', 'color',
                'font-size', 'font-weight', 'display', 'flex-direction',
                'justify-content', 'align-items', 'padding', 'margin',
                'filter', 'object-fit'
              ];
              
              criticalProps.forEach(prop => {
                const value = computedStyle.getPropertyValue(prop);
                if (value && value !== 'initial' && value !== 'auto') {
                  el.style.setProperty(prop, value, 'important');
                }
              });
              
              if (el.tagName === 'IMG') {
                el.style.setProperty('filter', 'grayscale(100%)', 'important');
                el.style.setProperty('object-fit', 'cover', 'important');
              }
            }
          });
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
      
      console.log('🎉 PERFECT PNG generated with EXACT preview copy!');
      
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