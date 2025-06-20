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
      
      // Force scroll to top and wait for full render
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Extended wait for complete rendering
      await new Promise(resolve => setTimeout(resolve, 4000));
      
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

      // Process each page individually with maximum quality settings
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Processing page ${i + 1}/${pages.length}`);
        
        // Ensure page is fully visible and rendered
        page.scrollIntoView({ behavior: 'instant', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Force all images to load with crossOrigin
        const images = page.querySelectorAll('img');
        for (const img of images) {
          if (!img.complete || img.naturalWidth === 0) {
            await new Promise<void>((resolve) => {
              const timeout = setTimeout(() => resolve(), 10000);
              img.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                resolve();
              };
              // Force reload with crossOrigin
              if (!img.crossOrigin) {
                img.crossOrigin = 'anonymous';
                const src = img.src;
                img.src = '';
                img.src = src;
              }
            });
          }
        }

        // Create canvas with maximum quality and exact style preservation
        const canvas = await html2canvas(page, {
          scale: 4, // Maximum scale for highest quality
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: true,
          width: page.offsetWidth,
          height: page.offsetHeight,
          windowWidth: 1920, // Fixed window width
          windowHeight: 1080, // Fixed window height
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: true,
          imageTimeout: 20000,
          removeContainer: false,
          ignoreElements: (element) => {
            return element.classList?.contains('print:hidden') || 
                   element.tagName === 'SCRIPT' ||
                   element.tagName === 'NOSCRIPT';
          },
          onclone: (clonedDoc, element) => {
            console.log('Cloning and applying styles...');
            
            // Copy all stylesheets first
            const originalStylesheets = Array.from(document.styleSheets);
            originalStylesheets.forEach(stylesheet => {
              try {
                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                const style = clonedDoc.createElement('style');
                style.textContent = rules.map(rule => rule.cssText).join('\n');
                clonedDoc.head.appendChild(style);
              } catch (e) {
                console.warn('Could not copy stylesheet:', e);
              }
            });
            
            // Copy all inline styles and computed styles
            const allOriginalElements = element.querySelectorAll('*');
            const allClonedElements = clonedDoc.querySelectorAll('*');
            
            allOriginalElements.forEach((originalEl, index) => {
              const clonedEl = allClonedElements[index] as HTMLElement;
              if (clonedEl && originalEl instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(originalEl);
                
                // Copy ALL computed styles
                const styleText = Array.from(computedStyle).map(prop => {
                  const value = computedStyle.getPropertyValue(prop);
                  return `${prop}: ${value} !important;`;
                }).join(' ');
                
                clonedEl.style.cssText = styleText;
                
                // Special handling for different element types
                if (originalEl.tagName === 'IMG') {
                  const img = originalEl as HTMLImageElement;
                  const clonedImg = clonedEl as HTMLImageElement;
                  clonedImg.src = img.src;
                  clonedImg.crossOrigin = 'anonymous';
                  
                  // Ensure image styling is preserved
                  clonedImg.style.filter = computedStyle.filter;
                  clonedImg.style.objectFit = computedStyle.objectFit;
                  clonedImg.style.objectPosition = computedStyle.objectPosition;
                  clonedImg.style.width = computedStyle.width;
                  clonedImg.style.height = computedStyle.height;
                }
                
                // Preserve background images
                if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
                  clonedEl.style.backgroundImage = computedStyle.backgroundImage;
                  clonedEl.style.backgroundSize = computedStyle.backgroundSize;
                  clonedEl.style.backgroundPosition = computedStyle.backgroundPosition;
                  clonedEl.style.backgroundRepeat = computedStyle.backgroundRepeat;
                }
                
                // Preserve text styling
                clonedEl.style.color = computedStyle.color;
                clonedEl.style.fontSize = computedStyle.fontSize;
                clonedEl.style.fontFamily = computedStyle.fontFamily;
                clonedEl.style.fontWeight = computedStyle.fontWeight;
                clonedEl.style.textAlign = computedStyle.textAlign;
                clonedEl.style.lineHeight = computedStyle.lineHeight;
                clonedEl.style.textShadow = computedStyle.textShadow;
                
                // Preserve layout
                clonedEl.style.display = computedStyle.display;
                clonedEl.style.position = computedStyle.position;
                clonedEl.style.top = computedStyle.top;
                clonedEl.style.left = computedStyle.left;
                clonedEl.style.right = computedStyle.right;
                clonedEl.style.bottom = computedStyle.bottom;
                clonedEl.style.width = computedStyle.width;
                clonedEl.style.height = computedStyle.height;
                clonedEl.style.minHeight = computedStyle.minHeight;
                clonedEl.style.padding = computedStyle.padding;
                clonedEl.style.margin = computedStyle.margin;
                
                // Preserve visual effects
                clonedEl.style.backgroundColor = computedStyle.backgroundColor;
                clonedEl.style.border = computedStyle.border;
                clonedEl.style.borderRadius = computedStyle.borderRadius;
                clonedEl.style.boxShadow = computedStyle.boxShadow;
                clonedEl.style.opacity = computedStyle.opacity;
                clonedEl.style.transform = computedStyle.transform;
                clonedEl.style.filter = computedStyle.filter;
              }
            });
            
            // Ensure body and html have proper styling
            clonedDoc.body.style.margin = '0';
            clonedDoc.body.style.padding = '0';
            clonedDoc.documentElement.style.margin = '0';
            clonedDoc.documentElement.style.padding = '0';
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
      
      // Force scroll to top and ensure visibility
      window.scrollTo(0, 0);
      content.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Extended wait for complete rendering
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Get all newsletter pages
      const pages = content.querySelectorAll('.newsletter-page');
      console.log('Found newsletter pages:', pages.length);
      
      if (pages.length === 0) {
        throw new Error('No newsletter pages found');
      }

      // Force all images to load properly
      const allImages = content.querySelectorAll('img');
      for (const img of allImages) {
        if (!img.complete || img.naturalWidth === 0) {
          await new Promise<void>((resolve) => {
            const timeout = setTimeout(() => resolve(), 10000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timeout);
              resolve();
            };
            // Force reload with crossOrigin
            if (!img.crossOrigin) {
              img.crossOrigin = 'anonymous';
              const src = img.src;
              img.src = '';
              img.src = src;
            }
          });
        }
      }

      // Additional wait for everything to settle
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create canvas with maximum quality settings
      const canvas = await html2canvas(content, {
        scale: 4, // Maximum scale
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: true,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: 1920,
        windowHeight: 1080,
        foreignObjectRendering: true,
        imageTimeout: 20000,
        removeContainer: false,
        ignoreElements: (element) => {
          return element.classList?.contains('print:hidden') || 
                 element.tagName === 'SCRIPT' ||
                 element.tagName === 'NOSCRIPT';
        },
        onclone: (clonedDoc, element) => {
          console.log('Cloning for PNG with exact styles...');
          
          // Copy all stylesheets
          const originalStylesheets = Array.from(document.styleSheets);
          originalStylesheets.forEach(stylesheet => {
            try {
              const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
              const style = clonedDoc.createElement('style');
              style.textContent = rules.map(rule => rule.cssText).join('\n');
              clonedDoc.head.appendChild(style);
            } catch (e) {
              console.warn('Could not copy stylesheet:', e);
            }
          });
          
          // Apply all computed styles exactly
          const allOriginalElements = element.querySelectorAll('*');
          const allClonedElements = clonedDoc.querySelectorAll('*');
          
          allOriginalElements.forEach((originalEl, index) => {
            const clonedEl = allClonedElements[index] as HTMLElement;
            if (clonedEl && originalEl instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(originalEl);
              
              // Copy every single computed style property
              for (let i = 0; i < computedStyle.length; i++) {
                const prop = computedStyle[i];
                const value = computedStyle.getPropertyValue(prop);
                if (value) {
                  clonedEl.style.setProperty(prop, value, 'important');
                }
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
          
          // Ensure proper document styling
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';
          clonedDoc.documentElement.style.margin = '0';
          clonedDoc.documentElement.style.padding = '0';
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