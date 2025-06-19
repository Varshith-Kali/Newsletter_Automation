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
      
      // Scroll to top and wait for everything to settle
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

      // Process each page with enhanced settings
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is fully visible and loaded
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Wait for all images in this page to fully load
        const images = page.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise(resolve => {
            const timeout = setTimeout(() => resolve(undefined), 5000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve(undefined);
            };
            img.onerror = () => {
              clearTimeout(timeout);
              resolve(undefined);
            };
          });
        }));

        // Enhanced canvas creation with exact styling preservation
        const canvas = await html2canvas(page, {
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: false,
          backgroundColor: null, // Preserve original background
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: true, // Better text rendering
          imageTimeout: 10000,
          removeContainer: true,
          onclone: (clonedDoc) => {
            // Ensure all styles are preserved in the clone
            const clonedPage = clonedDoc.querySelector('.newsletter-page');
            if (clonedPage) {
              // Force all computed styles to be inline
              const originalElements = page.querySelectorAll('*');
              const clonedElements = clonedPage.querySelectorAll('*');
              
              originalElements.forEach((el, index) => {
                if (clonedElements[index]) {
                  const computedStyle = window.getComputedStyle(el);
                  const clonedEl = clonedElements[index] as HTMLElement;
                  
                  // Copy critical styles
                  clonedEl.style.color = computedStyle.color;
                  clonedEl.style.backgroundColor = computedStyle.backgroundColor;
                  clonedEl.style.fontSize = computedStyle.fontSize;
                  clonedEl.style.fontFamily = computedStyle.fontFamily;
                  clonedEl.style.fontWeight = computedStyle.fontWeight;
                  clonedEl.style.textAlign = computedStyle.textAlign;
                  clonedEl.style.padding = computedStyle.padding;
                  clonedEl.style.margin = computedStyle.margin;
                  clonedEl.style.border = computedStyle.border;
                  clonedEl.style.borderRadius = computedStyle.borderRadius;
                  clonedEl.style.boxShadow = computedStyle.boxShadow;
                  clonedEl.style.backgroundImage = computedStyle.backgroundImage;
                  clonedEl.style.backgroundSize = computedStyle.backgroundSize;
                  clonedEl.style.backgroundPosition = computedStyle.backgroundPosition;
                  clonedEl.style.backgroundRepeat = computedStyle.backgroundRepeat;
                  clonedEl.style.filter = computedStyle.filter;
                  clonedEl.style.opacity = computedStyle.opacity;
                }
              });
            }
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
        const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
        const imgWidth = canvas.width * 0.264583; // Convert px to mm
        const imgHeight = canvas.height * 0.264583;
        
        // Scale to fit A4 (210 x 297 mm) while maintaining aspect ratio
        const scale = Math.min(210 / imgWidth, 297 / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        // Center on page
        const x = (210 - scaledWidth) / 2;
        const y = (297 - scaledHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight, undefined, 'FAST');
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('PDF generated successfully with', pages.length, 'pages');
      
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
      
      // Scroll to top and wait
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('Found newsletter pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Create a temporary container to hold all pages
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.backgroundColor = 'transparent';
      tempContainer.style.width = '1200px';
      tempContainer.style.zIndex = '-1000';
      document.body.appendChild(tempContainer);

      // Clone all pages with their exact styling
      let totalHeight = 0;
      const pageHeight = 800; // Fixed height per page
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const clone = page.cloneNode(true) as HTMLElement;
        
        // Preserve exact styling
        clone.style.position = 'relative';
        clone.style.width = '1200px';
        clone.style.height = pageHeight + 'px';
        clone.style.display = 'block';
        clone.style.overflow = 'hidden';
        clone.style.pageBreakAfter = 'auto';
        
        // Copy all computed styles to ensure exact appearance
        const allElements = page.querySelectorAll('*');
        const clonedElements = clone.querySelectorAll('*');
        
        allElements.forEach((el, index) => {
          if (clonedElements[index]) {
            const computedStyle = window.getComputedStyle(el);
            const clonedEl = clonedElements[index] as HTMLElement;
            
            // Apply all critical styles
            clonedEl.style.cssText = computedStyle.cssText;
          }
        });
        
        tempContainer.appendChild(clone);
        totalHeight += pageHeight;
      }

      tempContainer.style.height = totalHeight + 'px';

      // Wait for all images to load in the cloned content
      const allImages = tempContainer.querySelectorAll('img');
      await Promise.all(Array.from(allImages).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
          const timeout = setTimeout(() => resolve(undefined), 5000);
          img.onload = () => {
            clearTimeout(timeout);
            resolve(undefined);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve(undefined);
          };
        });
      }));

      // Wait a bit more for everything to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create canvas with enhanced settings
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: 1200,
        height: totalHeight,
        foreignObjectRendering: true,
        imageTimeout: 10000,
        removeContainer: true
      });

      // Clean up
      document.body.removeChild(tempContainer);

      console.log('Combined canvas:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      // Download the image with maximum quality
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