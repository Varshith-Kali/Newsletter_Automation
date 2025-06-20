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
      
      // Scroll to top and wait for rendering
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

      // Process each page with simplified but effective approach
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is visible
        page.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Wait for images to load
        const images = page.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise(resolve => {
            const timeout = setTimeout(() => resolve(undefined), 8000);
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

        // Create canvas with optimized settings
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff', // Force white background
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false, // Disable to avoid conflicts
          imageTimeout: 15000,
          removeContainer: true,
          ignoreElements: (element) => {
            return element.classList?.contains('print:hidden');
          },
          onclone: (clonedDoc, element) => {
            // Simple and effective style preservation
            const clonedPage = clonedDoc.querySelector('.newsletter-page');
            if (clonedPage) {
              // Ensure proper background
              clonedDoc.body.style.backgroundColor = '#ffffff';
              clonedDoc.body.style.margin = '0';
              clonedDoc.body.style.padding = '0';
              
              // Copy critical styles only
              const allElements = element.querySelectorAll('*');
              const clonedElements = clonedPage.querySelectorAll('*');
              
              allElements.forEach((el, index) => {
                if (clonedElements[index] && el instanceof HTMLElement) {
                  const computedStyle = window.getComputedStyle(el);
                  const clonedEl = clonedElements[index] as HTMLElement;
                  
                  // Copy only essential visual styles
                  clonedEl.style.color = computedStyle.color;
                  clonedEl.style.backgroundColor = computedStyle.backgroundColor;
                  clonedEl.style.fontSize = computedStyle.fontSize;
                  clonedEl.style.fontFamily = computedStyle.fontFamily;
                  clonedEl.style.fontWeight = computedStyle.fontWeight;
                  clonedEl.style.textAlign = computedStyle.textAlign;
                  clonedEl.style.display = computedStyle.display;
                  clonedEl.style.position = computedStyle.position;
                  clonedEl.style.width = computedStyle.width;
                  clonedEl.style.height = computedStyle.height;
                  clonedEl.style.minHeight = computedStyle.minHeight;
                  clonedEl.style.padding = computedStyle.padding;
                  clonedEl.style.margin = computedStyle.margin;
                  clonedEl.style.border = computedStyle.border;
                  clonedEl.style.borderRadius = computedStyle.borderRadius;
                  clonedEl.style.backgroundImage = computedStyle.backgroundImage;
                  clonedEl.style.backgroundSize = computedStyle.backgroundSize;
                  clonedEl.style.backgroundPosition = computedStyle.backgroundPosition;
                  clonedEl.style.backgroundRepeat = computedStyle.backgroundRepeat;
                  clonedEl.style.filter = computedStyle.filter;
                  clonedEl.style.objectFit = computedStyle.objectFit;
                  clonedEl.style.objectPosition = computedStyle.objectPosition;
                  
                  // Handle images specifically
                  if (el.tagName === 'IMG') {
                    const img = el as HTMLImageElement;
                    const clonedImg = clonedEl as HTMLImageElement;
                    clonedImg.crossOrigin = 'anonymous';
                    clonedImg.src = img.src;
                  }
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

        // Calculate dimensions to fit A4
        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = canvas.width * 0.264583;
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
      
      // Scroll to top and wait
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('Found newsletter pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Wait for all images to load
      const allImages = content.querySelectorAll('img');
      await Promise.all(Array.from(allImages).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
          const timeout = setTimeout(() => resolve(undefined), 8000);
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

      // Additional wait for everything to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create canvas with simplified settings
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff', // Force white background
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
        ignoreElements: (element) => {
          return element.classList?.contains('print:hidden');
        },
        onclone: (clonedDoc, element) => {
          // Simple style preservation for PNG
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';
          
          const allElements = element.querySelectorAll('*');
          const clonedElements = clonedDoc.querySelectorAll('*');
          
          allElements.forEach((el, index) => {
            if (clonedElements[index] && el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              const clonedEl = clonedElements[index] as HTMLElement;
              
              // Copy essential styles
              clonedEl.style.color = computedStyle.color;
              clonedEl.style.backgroundColor = computedStyle.backgroundColor;
              clonedEl.style.fontSize = computedStyle.fontSize;
              clonedEl.style.fontFamily = computedStyle.fontFamily;
              clonedEl.style.fontWeight = computedStyle.fontWeight;
              clonedEl.style.textAlign = computedStyle.textAlign;
              clonedEl.style.display = computedStyle.display;
              clonedEl.style.width = computedStyle.width;
              clonedEl.style.height = computedStyle.height;
              clonedEl.style.minHeight = computedStyle.minHeight;
              clonedEl.style.padding = computedStyle.padding;
              clonedEl.style.margin = computedStyle.margin;
              clonedEl.style.backgroundImage = computedStyle.backgroundImage;
              clonedEl.style.backgroundSize = computedStyle.backgroundSize;
              clonedEl.style.backgroundPosition = computedStyle.backgroundPosition;
              clonedEl.style.filter = computedStyle.filter;
              clonedEl.style.objectFit = computedStyle.objectFit;
              
              // Handle images
              if (el.tagName === 'IMG') {
                const img = el as HTMLImageElement;
                const clonedImg = clonedEl as HTMLImageElement;
                clonedImg.crossOrigin = 'anonymous';
                clonedImg.src = img.src;
              }
            }
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