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
      console.log('🔧 Starting EXACT PDF generation...');
      
      // Force scroll to top and ensure visibility
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Wait for layout stabilization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('🔧 Found pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Pre-load ALL images with proper error handling
      console.log('🔧 Pre-loading all images...');
      const allImages = content.querySelectorAll('img');
      console.log('🔧 Found images:', allImages.length);
      
      await Promise.all(Array.from(allImages).map((img, index) => {
        return new Promise<void>((resolve) => {
          console.log(`🔧 Loading image ${index + 1}:`, img.src);
          
          if (img.complete && img.naturalWidth > 0) {
            console.log(`🔧 Image ${index + 1} already loaded`);
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => {
            console.log(`🔧 Image ${index + 1} timeout - continuing`);
            resolve();
          }, 8000);
          
          img.onload = () => {
            console.log(`🔧 Image ${index + 1} loaded successfully`);
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            console.log(`🔧 Image ${index + 1} failed to load - continuing`);
            clearTimeout(timeout);
            resolve();
          };
        });
      }));

      console.log('🔧 All images processed, waiting for final render...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page with EXACT layout preservation
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`🔧 Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is visible and properly positioned
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`🔧 Page ${i + 1} dimensions:`, page.offsetWidth, 'x', page.offsetHeight);

        // Create canvas with EXACT layout preservation
        const canvas = await html2canvas(page, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false,
          imageTimeout: 10000,
          removeContainer: false,
          ignoreElements: (element) => {
            return element.classList?.contains('print:hidden') || false;
          },
          onclone: (clonedDoc, element) => {
            console.log('🔧 Cloning document for EXACT layout preservation');
            
            // Force all elements to maintain exact positioning and sizing
            const allElements = element.querySelectorAll('*');
            const clonedElements = clonedDoc.querySelectorAll('*');
            
            allElements.forEach((originalEl, index) => {
              const clonedEl = clonedElements[index] as HTMLElement;
              if (clonedEl && originalEl instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(originalEl);
                const rect = originalEl.getBoundingClientRect();
                
                // Copy ALL computed styles with maximum priority
                for (let j = 0; j < computedStyle.length; j++) {
                  const prop = computedStyle[j];
                  const value = computedStyle.getPropertyValue(prop);
                  if (value && value !== 'initial' && value !== 'inherit' && value !== 'auto') {
                    clonedEl.style.setProperty(prop, value, 'important');
                  }
                }
                
                // Force exact positioning and dimensions
                const criticalStyles = {
                  'position': computedStyle.position,
                  'top': computedStyle.top,
                  'left': computedStyle.left,
                  'right': computedStyle.right,
                  'bottom': computedStyle.bottom,
                  'width': computedStyle.width,
                  'height': computedStyle.height,
                  'min-width': computedStyle.minWidth,
                  'min-height': computedStyle.minHeight,
                  'max-width': computedStyle.maxWidth,
                  'max-height': computedStyle.maxHeight,
                  'margin': computedStyle.margin,
                  'margin-top': computedStyle.marginTop,
                  'margin-right': computedStyle.marginRight,
                  'margin-bottom': computedStyle.marginBottom,
                  'margin-left': computedStyle.marginLeft,
                  'padding': computedStyle.padding,
                  'padding-top': computedStyle.paddingTop,
                  'padding-right': computedStyle.paddingRight,
                  'padding-bottom': computedStyle.paddingBottom,
                  'padding-left': computedStyle.paddingLeft,
                  'border': computedStyle.border,
                  'border-width': computedStyle.borderWidth,
                  'border-style': computedStyle.borderStyle,
                  'border-color': computedStyle.borderColor,
                  'border-radius': computedStyle.borderRadius,
                  'background': computedStyle.background,
                  'background-color': computedStyle.backgroundColor,
                  'background-image': computedStyle.backgroundImage,
                  'background-size': computedStyle.backgroundSize,
                  'background-position': computedStyle.backgroundPosition,
                  'background-repeat': computedStyle.backgroundRepeat,
                  'color': computedStyle.color,
                  'font-family': computedStyle.fontFamily,
                  'font-size': computedStyle.fontSize,
                  'font-weight': computedStyle.fontWeight,
                  'font-style': computedStyle.fontStyle,
                  'line-height': computedStyle.lineHeight,
                  'text-align': computedStyle.textAlign,
                  'text-decoration': computedStyle.textDecoration,
                  'text-transform': computedStyle.textTransform,
                  'letter-spacing': computedStyle.letterSpacing,
                  'word-spacing': computedStyle.wordSpacing,
                  'display': computedStyle.display,
                  'flex': computedStyle.flex,
                  'flex-direction': computedStyle.flexDirection,
                  'flex-wrap': computedStyle.flexWrap,
                  'justify-content': computedStyle.justifyContent,
                  'align-items': computedStyle.alignItems,
                  'align-content': computedStyle.alignContent,
                  'flex-grow': computedStyle.flexGrow,
                  'flex-shrink': computedStyle.flexShrink,
                  'flex-basis': computedStyle.flexBasis,
                  'order': computedStyle.order,
                  'z-index': computedStyle.zIndex,
                  'opacity': computedStyle.opacity,
                  'visibility': computedStyle.visibility,
                  'overflow': computedStyle.overflow,
                  'overflow-x': computedStyle.overflowX,
                  'overflow-y': computedStyle.overflowY,
                  'white-space': computedStyle.whiteSpace,
                  'word-wrap': computedStyle.wordWrap,
                  'word-break': computedStyle.wordBreak,
                  'box-sizing': computedStyle.boxSizing,
                  'box-shadow': computedStyle.boxShadow,
                  'transform': computedStyle.transform,
                  'transform-origin': computedStyle.transformOrigin,
                  'transition': computedStyle.transition,
                  'filter': computedStyle.filter,
                  'backdrop-filter': computedStyle.backdropFilter
                };
                
                Object.entries(criticalStyles).forEach(([prop, value]) => {
                  if (value && value !== 'none' && value !== 'initial' && value !== 'auto' && value !== 'normal') {
                    clonedEl.style.setProperty(prop, value, 'important');
                  }
                });
                
                // Special handling for images to maintain exact appearance
                if (originalEl.tagName === 'IMG') {
                  const img = originalEl as HTMLImageElement;
                  const clonedImg = clonedEl as HTMLImageElement;
                  clonedImg.src = img.src;
                  clonedImg.crossOrigin = 'anonymous';
                  
                  // Force exact image styling
                  clonedImg.style.setProperty('width', computedStyle.width, 'important');
                  clonedImg.style.setProperty('height', computedStyle.height, 'important');
                  clonedImg.style.setProperty('object-fit', computedStyle.objectFit, 'important');
                  clonedImg.style.setProperty('object-position', computedStyle.objectPosition, 'important');
                  clonedImg.style.setProperty('filter', computedStyle.filter, 'important');
                  clonedImg.style.setProperty('opacity', computedStyle.opacity, 'important');
                }
                
                // Force specific color schemes
                if (computedStyle.backgroundColor.includes('rgb(185, 28, 28)') || 
                    computedStyle.backgroundColor.includes('rgb(153, 27, 27)') ||
                    originalEl.classList.contains('bg-red-700')) {
                  clonedEl.style.setProperty('background-color', '#b91c1c', 'important');
                }
                
                if (computedStyle.backgroundColor.includes('rgb(0, 0, 0)') ||
                    originalEl.classList.contains('bg-black')) {
                  clonedEl.style.setProperty('background-color', '#000000', 'important');
                }
                
                if (computedStyle.color.includes('rgb(255, 255, 255)') ||
                    originalEl.classList.contains('text-white')) {
                  clonedEl.style.setProperty('color', '#ffffff', 'important');
                }
                
                if (computedStyle.color.includes('rgb(0, 0, 0)') ||
                    originalEl.classList.contains('text-black')) {
                  clonedEl.style.setProperty('color', '#000000', 'important');
                }
              }
            });
            
            // Inject comprehensive CSS to ensure exact styling
            const additionalCSS = clonedDoc.createElement('style');
            additionalCSS.textContent = `
              * { 
                box-sizing: border-box !important; 
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
              }
              
              /* Force exact Tailwind classes */
              .bg-red-700 { background-color: #b91c1c !important; }
              .bg-black { background-color: #000000 !important; }
              .bg-white { background-color: #ffffff !important; }
              .text-white { color: #ffffff !important; }
              .text-black { color: #000000 !important; }
              .text-red-700 { color: #b91c1c !important; }
              
              /* Force image styling */
              img { 
                object-fit: cover !important; 
                filter: grayscale(100%) !important;
                display: block !important;
              }
              .grayscale { filter: grayscale(100%) !important; }
              
              /* Force layout classes */
              .min-h-screen { min-height: 100vh !important; height: 100vh !important; }
              .h-screen { height: 100vh !important; }
              .flex { display: flex !important; }
              .relative { position: relative !important; }
              .absolute { position: absolute !important; }
              .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
              
              /* Force exact spacing */
              .p-8 { padding: 2rem !important; }
              .p-6 { padding: 1.5rem !important; }
              .p-4 { padding: 1rem !important; }
              .m-8 { margin: 2rem !important; }
              .mb-8 { margin-bottom: 2rem !important; }
              .mt-8 { margin-top: 2rem !important; }
              .ml-8 { margin-left: 2rem !important; }
              
              /* Force exact widths */
              .w-5\/12 { width: 41.666667% !important; }
              .w-7\/12 { width: 58.333333% !important; }
              .w-1\/2 { width: 50% !important; }
              .w-1\/3 { width: 33.333333% !important; }
              .w-2\/3 { width: 66.666667% !important; }
              .w-full { width: 100% !important; }
              
              /* Force exact heights */
              .h-1\/3 { height: 33.333333% !important; }
              .h-2\/3 { height: 66.666667% !important; }
              .h-full { height: 100% !important; }
              
              /* Force typography */
              .text-8xl { font-size: 6rem !important; line-height: 1 !important; }
              .text-6xl { font-size: 3.75rem !important; line-height: 1 !important; }
              .text-5xl { font-size: 3rem !important; line-height: 1 !important; }
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
              
              /* Force exact positioning */
              .top-0 { top: 0 !important; }
              .right-0 { right: 0 !important; }
              .bottom-0 { bottom: 0 !important; }
              .left-0 { left: 0 !important; }
              
              /* Force opacity */
              .opacity-60 { opacity: 0.6 !important; }
              
              /* Force overflow */
              .overflow-hidden { overflow: hidden !important; }
              
              /* Force rounded corners */
              .rounded-full { border-radius: 9999px !important; }
              .rounded-lg { border-radius: 0.5rem !important; }
              
              /* Force shadows */
              .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
            `;
            clonedDoc.head.appendChild(additionalCSS);
            
            console.log('🔧 Enhanced styling applied for exact layout preservation');
          }
        });

        console.log(`🔧 Page ${i + 1} canvas created:`, canvas.width, 'x', canvas.height);

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`🔧 Page ${i + 1} has zero dimensions, skipping`);
          continue;
        }

        // Add new page if not the first
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate dimensions to fit A4 perfectly while maintaining exact proportions
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        
        // Calculate scaling to fit page while maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = pdfWidth / pdfHeight;
        
        let finalWidth, finalHeight, x, y;
        
        if (canvasAspectRatio > pageAspectRatio) {
          // Canvas is wider than page ratio - fit to width
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / canvasAspectRatio;
          x = 0;
          y = (pdfHeight - finalHeight) / 2;
        } else {
          // Canvas is taller than page ratio - fit to height
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * canvasAspectRatio;
          x = (pdfWidth - finalWidth) / 2;
          y = 0;
        }

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight, undefined, 'FAST');
        console.log(`🔧 Page ${i + 1} added to PDF with exact proportions`);
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🔧 PDF generated with EXACT layout preservation');
      
    } catch (error) {
      console.error('🔧 PDF generation failed:', error);
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
      console.log('🔧 Starting EXACT PNG generation...');
      
      // Force scroll to top
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pre-load all images with same logic as PDF
      const allImages = content.querySelectorAll('img');
      await Promise.all(Array.from(allImages).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => resolve(), 8000);
          
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

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create canvas with EXACT same settings as PDF
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
        foreignObjectRendering: false,
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: (element) => {
          return element.classList?.contains('print:hidden') || false;
        },
        onclone: (clonedDoc, element) => {
          // Use EXACT same cloning logic as PDF
          const allElements = element.querySelectorAll('*');
          const clonedElements = clonedDoc.querySelectorAll('*');
          
          allElements.forEach((originalEl, index) => {
            const clonedEl = clonedElements[index] as HTMLElement;
            if (clonedEl && originalEl instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(originalEl);
              
              // Copy all computed styles
              for (let i = 0; i < computedStyle.length; i++) {
                const prop = computedStyle[i];
                const value = computedStyle.getPropertyValue(prop);
                if (value && value !== 'initial' && value !== 'inherit' && value !== 'auto') {
                  clonedEl.style.setProperty(prop, value, 'important');
                }
              }
              
              // Apply same critical styles as PDF
              if (originalEl.tagName === 'IMG') {
                const img = originalEl as HTMLImageElement;
                const clonedImg = clonedEl as HTMLImageElement;
                clonedImg.src = img.src;
                clonedImg.crossOrigin = 'anonymous';
                clonedImg.style.setProperty('filter', 'grayscale(100%)', 'important');
              }
              
              // Force same color schemes as PDF
              if (originalEl.classList.contains('bg-red-700')) {
                clonedEl.style.setProperty('background-color', '#b91c1c', 'important');
              }
              if (originalEl.classList.contains('bg-black')) {
                clonedEl.style.setProperty('background-color', '#000000', 'important');
              }
              if (originalEl.classList.contains('text-white')) {
                clonedEl.style.setProperty('color', '#ffffff', 'important');
              }
            }
          });
          
          // Apply same additional CSS as PDF
          const additionalCSS = clonedDoc.createElement('style');
          additionalCSS.textContent = `
            * { box-sizing: border-box !important; }
            .bg-red-700 { background-color: #b91c1c !important; }
            .bg-black { background-color: #000000 !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            img { object-fit: cover !important; filter: grayscale(100%) !important; }
            .grayscale { filter: grayscale(100%) !important; }
            .min-h-screen { min-height: 100vh !important; height: 100vh !important; }
            .flex { display: flex !important; }
            .relative { position: relative !important; }
            .absolute { position: absolute !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
          `;
          clonedDoc.head.appendChild(additionalCSS);
        }
      });

      console.log('🔧 PNG canvas:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      // Download with maximum quality
      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🔧 PNG generated with EXACT layout preservation');
      
    } catch (error) {
      console.error('🔧 PNG generation failed:', error);
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
                className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                style={{ 
                  backgroundColor: 'white',
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