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
      console.log('🔧 DEBUG: Starting enhanced PDF generation...');
      
      // Force scroll to top and ensure visibility
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('🔧 DEBUG: Found pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Pre-load ALL images across all pages
      console.log('🔧 DEBUG: Pre-loading all images...');
      const allImages = content.querySelectorAll('img');
      console.log('🔧 DEBUG: Found images:', allImages.length);
      
      await Promise.all(Array.from(allImages).map((img, index) => {
        return new Promise<void>((resolve) => {
          console.log(`🔧 DEBUG: Loading image ${index + 1}:`, img.src);
          
          if (img.complete && img.naturalWidth > 0) {
            console.log(`🔧 DEBUG: Image ${index + 1} already loaded`);
            resolve();
            return;
          }
          
          const timeout = setTimeout(() => {
            console.log(`🔧 DEBUG: Image ${index + 1} timeout`);
            resolve();
          }, 10000);
          
          img.onload = () => {
            console.log(`🔧 DEBUG: Image ${index + 1} loaded successfully`);
            clearTimeout(timeout);
            resolve();
          };
          
          img.onerror = () => {
            console.log(`🔧 DEBUG: Image ${index + 1} failed to load`);
            clearTimeout(timeout);
            resolve();
          };
          
          // Force reload if needed
          if (!img.complete) {
            const originalSrc = img.src;
            img.src = '';
            img.src = originalSrc;
          }
        });
      }));

      console.log('🔧 DEBUG: All images processed, waiting for final render...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page with enhanced debugging
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`🔧 DEBUG: Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is visible and styled
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log(`🔧 DEBUG: Page ${i + 1} dimensions:`, page.offsetWidth, 'x', page.offsetHeight);
        console.log(`🔧 DEBUG: Page ${i + 1} computed styles:`, window.getComputedStyle(page));

        // Enhanced canvas creation with maximum compatibility
        const canvas = await html2canvas(page, {
          scale: 2, // Reduced scale for better compatibility
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: true, // Enable logging for debugging
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false, // Disable for better compatibility
          imageTimeout: 15000,
          removeContainer: false,
          ignoreElements: (element) => {
            // Only ignore print-hidden elements
            return element.classList?.contains('print:hidden') || false;
          },
          onclone: (clonedDoc, element) => {
            console.log('🔧 DEBUG: Cloning document for page', i + 1);
            
            // Force all styles to be inline and important
            const allElements = element.querySelectorAll('*');
            const clonedElements = clonedDoc.querySelectorAll('*');
            
            console.log('🔧 DEBUG: Processing', allElements.length, 'elements');
            
            allElements.forEach((originalEl, index) => {
              const clonedEl = clonedElements[index] as HTMLElement;
              if (clonedEl && originalEl instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(originalEl);
                
                // Copy ALL computed styles with !important
                for (let j = 0; j < computedStyle.length; j++) {
                  const prop = computedStyle[j];
                  const value = computedStyle.getPropertyValue(prop);
                  if (value && value !== 'initial' && value !== 'inherit') {
                    clonedEl.style.setProperty(prop, value, 'important');
                  }
                }
                
                // Special handling for critical properties
                const criticalProps = {
                  'background-color': computedStyle.backgroundColor,
                  'color': computedStyle.color,
                  'font-family': computedStyle.fontFamily,
                  'font-size': computedStyle.fontSize,
                  'font-weight': computedStyle.fontWeight,
                  'text-align': computedStyle.textAlign,
                  'display': computedStyle.display,
                  'position': computedStyle.position,
                  'width': computedStyle.width,
                  'height': computedStyle.height,
                  'padding': computedStyle.padding,
                  'margin': computedStyle.margin,
                  'border': computedStyle.border,
                  'border-radius': computedStyle.borderRadius,
                  'box-shadow': computedStyle.boxShadow,
                  'filter': computedStyle.filter,
                  'opacity': computedStyle.opacity,
                  'transform': computedStyle.transform,
                  'background-image': computedStyle.backgroundImage,
                  'background-size': computedStyle.backgroundSize,
                  'background-position': computedStyle.backgroundPosition,
                  'background-repeat': computedStyle.backgroundRepeat
                };
                
                Object.entries(criticalProps).forEach(([prop, value]) => {
                  if (value && value !== 'none' && value !== 'initial') {
                    clonedEl.style.setProperty(prop, value, 'important');
                  }
                });
                
                // Force image properties
                if (originalEl.tagName === 'IMG') {
                  const img = originalEl as HTMLImageElement;
                  const clonedImg = clonedEl as HTMLImageElement;
                  clonedImg.src = img.src;
                  clonedImg.crossOrigin = 'anonymous';
                  clonedImg.style.setProperty('object-fit', 'cover', 'important');
                  clonedImg.style.setProperty('filter', computedStyle.filter, 'important');
                  clonedImg.style.setProperty('width', '100%', 'important');
                  clonedImg.style.setProperty('height', '100%', 'important');
                }
                
                // Force background colors for red sections
                if (originalEl.classList.contains('bg-red-700') || 
                    computedStyle.backgroundColor.includes('rgb(185, 28, 28)') ||
                    computedStyle.backgroundColor.includes('rgb(153, 27, 27)')) {
                  clonedEl.style.setProperty('background-color', '#b91c1c', 'important');
                }
                
                // Force text colors
                if (computedStyle.color.includes('rgb(255, 255, 255)')) {
                  clonedEl.style.setProperty('color', '#ffffff', 'important');
                }
                
                if (computedStyle.color.includes('rgb(0, 0, 0)')) {
                  clonedEl.style.setProperty('color', '#000000', 'important');
                }
              }
            });
            
            // Copy all stylesheets to cloned document
            const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
            originalStyles.forEach(styleEl => {
              const clonedStyle = styleEl.cloneNode(true);
              clonedDoc.head.appendChild(clonedStyle);
            });
            
            // Add additional CSS to ensure styles are applied
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
              .h-screen { height: 100vh !important; }
              .flex { display: flex !important; }
              .relative { position: relative !important; }
              .absolute { position: absolute !important; }
              .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            `;
            clonedDoc.head.appendChild(additionalCSS);
            
            console.log('🔧 DEBUG: Document cloning completed for page', i + 1);
          }
        });

        console.log(`🔧 DEBUG: Page ${i + 1} canvas created:`, canvas.width, 'x', canvas.height);

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`🔧 DEBUG: Page ${i + 1} has zero dimensions, skipping`);
          continue;
        }

        // Add new page if not the first
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate dimensions to fit A4 perfectly
        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = canvas.width * 0.264583; // Convert px to mm
        const imgHeight = canvas.height * 0.264583;
        
        // Scale to fit A4 while maintaining aspect ratio
        const scale = Math.min(210 / imgWidth, 297 / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        // Center on page
        const x = (210 - scaledWidth) / 2;
        const y = (297 - scaledHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight, undefined, 'FAST');
        console.log(`🔧 DEBUG: Page ${i + 1} added to PDF`);
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🔧 DEBUG: PDF generated successfully');
      
    } catch (error) {
      console.error('🔧 DEBUG: PDF generation failed:', error);
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
      console.log('🔧 DEBUG: Starting PNG generation...');
      
      // Force scroll to top
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Pre-load all images
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

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create canvas with same enhanced settings as PDF
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: true,
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
          // Same enhanced cloning logic as PDF
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
                if (value && value !== 'initial' && value !== 'inherit') {
                  clonedEl.style.setProperty(prop, value, 'important');
                }
              }
              
              // Special handling for images and backgrounds
              if (originalEl.tagName === 'IMG') {
                const img = originalEl as HTMLImageElement;
                const clonedImg = clonedEl as HTMLImageElement;
                clonedImg.src = img.src;
                clonedImg.crossOrigin = 'anonymous';
                clonedImg.style.setProperty('filter', 'grayscale(100%)', 'important');
              }
              
              // Force critical colors
              if (originalEl.classList.contains('bg-red-700')) {
                clonedEl.style.setProperty('background-color', '#b91c1c', 'important');
              }
            }
          });
          
          // Copy stylesheets
          const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
          originalStyles.forEach(styleEl => {
            const clonedStyle = styleEl.cloneNode(true);
            clonedDoc.head.appendChild(clonedStyle);
          });
        }
      });

      console.log('🔧 DEBUG: PNG canvas:', canvas.width, 'x', canvas.height);

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
      
      console.log('🔧 DEBUG: PNG generated successfully');
      
    } catch (error) {
      console.error('🔧 DEBUG: PNG generation failed:', error);
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