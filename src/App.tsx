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
      console.log('🔍 Starting PDF generation...');
      console.log('📋 Content element:', content);
      console.log('📏 Content dimensions:', content.offsetWidth, 'x', content.offsetHeight);
      
      // Scroll to top and wait
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First, let's check what we can find
      const allDivs = content.querySelectorAll('div');
      console.log('📦 Total divs found:', allDivs.length);
      
      // Look for newsletter pages with different selectors
      let pages = content.querySelectorAll('.newsletter-page');
      console.log('📄 Pages with .newsletter-page:', pages.length);
      
      if (pages.length === 0) {
        // Try alternative selectors
        pages = content.querySelectorAll('.newsletter-cover, .newsletter-threats, .newsletter-best-practices');
        console.log('📄 Pages with specific classes:', pages.length);
      }
      
      if (pages.length === 0) {
        // Try to find the newsletter component directly
        const newsletterDiv = content.querySelector('.newsletter');
        if (newsletterDiv) {
          pages = newsletterDiv.querySelectorAll('div');
          console.log('📄 Direct newsletter divs:', pages.length);
        }
      }
      
      if (pages.length === 0) {
        // Last resort - capture the entire content
        console.log('⚠️ No specific pages found, capturing entire content');
        pages = [content];
      }

      console.log('✅ Final pages to process:', pages.length);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`🔄 Processing page ${i + 1}/${pages.length}`);
        console.log('📏 Page dimensions:', page.offsetWidth, 'x', page.offsetHeight);
        console.log('🎨 Page background:', window.getComputedStyle(page).backgroundColor);
        
        // Make sure the page is visible
        page.style.display = 'block';
        page.style.visibility = 'visible';
        page.style.opacity = '1';
        
        // Scroll to the page
        page.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Wait for images
        const images = page.querySelectorAll('img');
        console.log(`🖼️ Images in page ${i + 1}:`, images.length);
        
        for (const img of images) {
          if (!img.complete || img.naturalWidth === 0) {
            console.log('⏳ Waiting for image:', img.src);
            await new Promise(resolve => {
              const timeout = setTimeout(() => resolve(undefined), 3000);
              img.onload = () => {
                clearTimeout(timeout);
                console.log('✅ Image loaded:', img.src);
                resolve(undefined);
              };
              img.onerror = () => {
                clearTimeout(timeout);
                console.log('❌ Image failed:', img.src);
                resolve(undefined);
              };
            });
          }
        }

        // Create canvas with debug logging
        console.log('🎨 Creating canvas for page', i + 1);
        const canvas = await html2canvas(page, {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: true, // Enable logging for debugging
          width: page.offsetWidth || 1200,
          height: page.offsetHeight || 800,
          windowWidth: 1200,
          windowHeight: 800,
          scrollX: 0,
          scrollY: 0,
          imageTimeout: 5000,
          onclone: (clonedDoc, element) => {
            console.log('🔄 Cloning document for canvas');
            // Ensure all styles are applied
            const clonedElement = element as HTMLElement;
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            
            // Apply Tailwind classes manually if needed
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const htmlEl = el as HTMLElement;
              if (htmlEl.classList.contains('bg-red-700')) {
                htmlEl.style.backgroundColor = '#b91c1c';
              }
              if (htmlEl.classList.contains('bg-black')) {
                htmlEl.style.backgroundColor = '#000000';
              }
              if (htmlEl.classList.contains('text-white')) {
                htmlEl.style.color = '#ffffff';
              }
              if (htmlEl.classList.contains('min-h-screen')) {
                htmlEl.style.minHeight = '100vh';
              }
            });
          }
        });

        console.log(`✅ Canvas created for page ${i + 1}:`, canvas.width, 'x', canvas.height);

        if (canvas.width === 0 || canvas.height === 0) {
          console.error(`❌ Page ${i + 1} canvas has zero dimensions!`);
          continue;
        }

        // Add to PDF
        if (i > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL('image/png', 0.95);
        const imgWidth = canvas.width * 0.264583;
        const imgHeight = canvas.height * 0.264583;
        
        const scale = Math.min(210 / imgWidth, 297 / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        const x = (210 - scaledWidth) / 2;
        const y = (297 - scaledHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        console.log(`✅ Added page ${i + 1} to PDF`);
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🎉 PDF generated successfully!');
      
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
      console.log('🔍 Starting PNG generation...');
      console.log('📋 Content element:', content);
      
      // Scroll to top
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find pages
      let pages = content.querySelectorAll('.newsletter-page');
      if (pages.length === 0) {
        pages = content.querySelectorAll('.newsletter-cover, .newsletter-threats, .newsletter-best-practices');
      }
      if (pages.length === 0) {
        const newsletterDiv = content.querySelector('.newsletter');
        if (newsletterDiv) {
          pages = newsletterDiv.querySelectorAll('div');
        }
      }
      if (pages.length === 0) {
        pages = [content];
      }

      console.log('📄 Pages found for PNG:', pages.length);

      // Create a visible container for combining pages
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.zIndex = '9999';
      tempContainer.style.visibility = 'visible';
      tempContainer.style.opacity = '1';
      document.body.appendChild(tempContainer);

      // Clone and combine all pages
      let totalHeight = 0;
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const clone = page.cloneNode(true) as HTMLElement;
        
        // Set explicit dimensions and styles
        clone.style.width = '1200px';
        clone.style.height = '800px';
        clone.style.display = 'block';
        clone.style.position = 'relative';
        clone.style.overflow = 'hidden';
        clone.style.backgroundColor = window.getComputedStyle(page).backgroundColor || '#ffffff';
        
        // Apply critical styles to cloned elements
        const originalElements = page.querySelectorAll('*');
        const clonedElements = clone.querySelectorAll('*');
        
        originalElements.forEach((el, index) => {
          if (clonedElements[index]) {
            const computedStyle = window.getComputedStyle(el);
            const clonedEl = clonedElements[index] as HTMLElement;
            
            // Copy essential styles
            clonedEl.style.backgroundColor = computedStyle.backgroundColor;
            clonedEl.style.color = computedStyle.color;
            clonedEl.style.fontSize = computedStyle.fontSize;
            clonedEl.style.fontFamily = computedStyle.fontFamily;
            clonedEl.style.fontWeight = computedStyle.fontWeight;
            clonedEl.style.textAlign = computedStyle.textAlign;
            clonedEl.style.backgroundImage = computedStyle.backgroundImage;
            clonedEl.style.backgroundSize = computedStyle.backgroundSize;
            clonedEl.style.backgroundPosition = computedStyle.backgroundPosition;
            clonedEl.style.filter = computedStyle.filter;
          }
        });
        
        tempContainer.appendChild(clone);
        totalHeight += 800;
      }

      tempContainer.style.height = totalHeight + 'px';

      // Wait for images to load
      const allImages = tempContainer.querySelectorAll('img');
      console.log('🖼️ Total images to load:', allImages.length);
      
      await Promise.all(Array.from(allImages).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
          const timeout = setTimeout(() => resolve(undefined), 3000);
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

      // Wait a bit more
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🎨 Creating combined canvas...');
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        width: 1200,
        height: totalHeight,
        windowWidth: 1200,
        windowHeight: totalHeight
      });

      // Clean up
      document.body.removeChild(tempContainer);

      console.log('✅ Combined canvas created:', canvas.width, 'x', canvas.height);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      // Download
      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🎉 PNG generated successfully!');
      
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
                className="border border-gray-300 rounded-lg overflow-hidden bg-white newsletter-container"
                style={{ 
                  backgroundColor: 'white',
                  position: 'relative',
                  minHeight: '400px'
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