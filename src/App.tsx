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
      console.log('Starting PDF generation...');
      
      // Ensure content is visible and fully rendered
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('Found newsletter pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page with exact styling capture
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is fully visible
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Wait for all images to load completely
        const images = page.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
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

        // Enhanced canvas creation with exact style preservation
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
          foreignObjectRendering: true,
          imageTimeout: 15000,
          removeContainer: false,
          ignoreElements: (element) => {
            // Skip any elements that might interfere
            return element.classList?.contains('print:hidden') || false;
          },
          onclone: (clonedDoc, element) => {
            // Force all styles to be computed and applied
            const allElements = element.querySelectorAll('*');
            const clonedElements = clonedDoc.querySelectorAll('*');
            
            allElements.forEach((originalEl, index) => {
              const clonedEl = clonedElements[index] as HTMLElement;
              if (clonedEl && originalEl instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(originalEl);
                
                // Apply all critical styles explicitly
                const criticalStyles = [
                  'color', 'backgroundColor', 'backgroundImage', 'backgroundSize',
                  'backgroundPosition', 'backgroundRepeat', 'fontSize', 'fontFamily',
                  'fontWeight', 'textAlign', 'padding', 'margin', 'border',
                  'borderRadius', 'boxShadow', 'filter', 'opacity', 'transform',
                  'display', 'position', 'top', 'left', 'right', 'bottom',
                  'width', 'height', 'minHeight', 'maxHeight', 'overflow',
                  'textShadow', 'lineHeight', 'letterSpacing', 'textTransform'
                ];
                
                criticalStyles.forEach(prop => {
                  const value = computedStyle.getPropertyValue(prop);
                  if (value) {
                    clonedEl.style.setProperty(prop, value, 'important');
                  }
                });
                
                // Ensure images maintain their appearance
                if (originalEl.tagName === 'IMG') {
                  const img = originalEl as HTMLImageElement;
                  const clonedImg = clonedEl as HTMLImageElement;
                  clonedImg.src = img.src;
                  clonedImg.crossOrigin = 'anonymous';
                  clonedImg.style.setProperty('filter', computedStyle.filter, 'important');
                  clonedImg.style.setProperty('object-fit', computedStyle.objectFit, 'important');
                  clonedImg.style.setProperty('object-position', computedStyle.objectPosition, 'important');
                }
              }
            });
            
            // Ensure the cloned document has the same styles
            const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
            originalStyles.forEach(styleEl => {
              const clonedStyle = styleEl.cloneNode(true);
              clonedDoc.head.appendChild(clonedStyle);
            });
          }
        });

        console.log(`Page ${i + 1} canvas:`, canvas.width, 'x', canvas.height);

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Page ${i + 1} has zero dimensions, skipping`);
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
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('PDF generated successfully');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
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
      console.log('Starting PNG generation...');
      
      // Ensure content is visible
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('Found newsletter pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Wait for all images across all pages to load
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

      // Additional wait for everything to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create canvas with enhanced settings for exact capture
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
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: (element) => {
          return element.classList?.contains('print:hidden') || false;
        },
        onclone: (clonedDoc, element) => {
          // Apply all computed styles to ensure exact appearance
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
                clonedEl.style.setProperty(prop, value, 'important');
              }
              
              // Special handling for images
              if (originalEl.tagName === 'IMG') {
                const img = originalEl as HTMLImageElement;
                const clonedImg = clonedEl as HTMLImageElement;
                clonedImg.src = img.src;
                clonedImg.crossOrigin = 'anonymous';
              }
            }
          });
          
          // Copy all stylesheets
          const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
          originalStyles.forEach(styleEl => {
            const clonedStyle = styleEl.cloneNode(true);
            clonedDoc.head.appendChild(clonedStyle);
          });
        }
      });

      console.log('Combined canvas:', canvas.width, 'x', canvas.height);

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
      
      console.log('PNG generated successfully');
      
    } catch (error) {
      console.error('PNG generation failed:', error);
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