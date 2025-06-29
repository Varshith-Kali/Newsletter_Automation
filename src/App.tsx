import React, { useRef } from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const printRef = useRef<HTMLDivElement>(null);

  // Function to convert image to grayscale canvas
  const convertImageToGrayscale = (img: HTMLImageElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data and convert to grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          
          // Use luminance formula for proper grayscale conversion
          const grayscale = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
          
          data[i] = grayscale;     // Red
          data[i + 1] = grayscale; // Green
          data[i + 2] = grayscale; // Blue
          // Alpha channel (data[i + 3]) remains unchanged
        }
        
        // Put the grayscale data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL
        resolve(canvas.toDataURL('image/png', 1.0));
      } catch (error) {
        reject(error);
      }
    });
  };

  // Function to extract image URLs from CSS background-image properties
  const extractBackgroundImageUrls = (element: HTMLElement): string[] => {
    const urls: string[] = [];
    const allElements = element.querySelectorAll('*');
    
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          // Extract URL from background-image CSS property
          const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            urls.push(urlMatch[1]);
          }
        }
      }
    });
    
    return [...new Set(urls)]; // Remove duplicates
  };

  // Function to preload and cache ALL images (both <img> tags and CSS backgrounds)
  const preloadAndCacheAllImages = async (element: HTMLElement): Promise<Map<string, string>> => {
    const imageCache = new Map<string, string>();
    
    // Get all <img> tag sources
    const imgElements = element.querySelectorAll('img');
    const imgSources = Array.from(imgElements)
      .filter(img => img instanceof HTMLImageElement && img.src)
      .map(img => (img as HTMLImageElement).src);
    
    // Get all CSS background image URLs
    const backgroundUrls = extractBackgroundImageUrls(element);
    
    // Combine all image URLs
    const allImageUrls = [...new Set([...imgSources, ...backgroundUrls])];
    
    console.log(`🖼️ Pre-loading and caching ${allImageUrls.length} images (${imgSources.length} <img> tags + ${backgroundUrls.length} CSS backgrounds)...`);
    
    const promises = allImageUrls.map(async (url, index) => {
      try {
        console.log(`📥 Pre-loading image ${index + 1}: ${url.substring(0, 50)}...`);
        
        // Create a new image to ensure it's fully loaded
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        
        await new Promise<void>((resolve, reject) => {
          tempImg.onload = () => resolve();
          tempImg.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          tempImg.src = url;
        });
        
        // Convert to grayscale and cache
        const grayscaleDataUrl = await convertImageToGrayscale(tempImg);
        imageCache.set(url, grayscaleDataUrl);
        
        console.log(`✅ Image ${index + 1} cached successfully`);
      } catch (error) {
        console.warn(`⚠️ Failed to cache image ${index + 1}:`, error);
        // Keep original src as fallback
        imageCache.set(url, url);
      }
    });
    
    await Promise.all(promises);
    console.log(`🎉 All ${imageCache.size} images cached (including CSS backgrounds)!`);
    return imageCache;
  };

  // Function to replace ALL images with cached grayscale versions
  const replaceAllImagesWithCachedVersions = (element: HTMLElement, imageCache: Map<string, string>): void => {
    console.log(`🔄 Replacing all images with cached grayscale versions...`);
    
    // Replace <img> tag sources
    const imgElements = element.querySelectorAll('img');
    imgElements.forEach((img, index) => {
      if (img instanceof HTMLImageElement && img.src) {
        const cachedVersion = imageCache.get(img.src);
        if (cachedVersion) {
          img.src = cachedVersion;
          img.style.filter = 'none'; // Remove any existing filters
          console.log(`✅ <img> ${index + 1} replaced with cached version`);
        } else {
          console.warn(`⚠️ No cached version found for <img> ${index + 1}: ${img.src}`);
        }
      }
    });
    
    // Replace CSS background images
    const allElements = element.querySelectorAll('*');
    let backgroundCount = 0;
    
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          // Extract URL from background-image CSS property
          const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            const originalUrl = urlMatch[1];
            const cachedVersion = imageCache.get(originalUrl);
            
            if (cachedVersion) {
              // Replace the background image with cached grayscale version
              el.style.setProperty('background-image', `url("${cachedVersion}")`, 'important');
              el.style.setProperty('filter', 'none', 'important');
              backgroundCount++;
              console.log(`✅ CSS background ${backgroundCount} replaced: ${originalUrl.substring(0, 50)}...`);
            } else {
              console.warn(`⚠️ No cached version found for CSS background: ${originalUrl}`);
            }
          }
        }
      }
    });
    
    console.log(`🎉 All images replaced: ${imgElements.length} <img> tags + ${backgroundCount} CSS backgrounds!`);
  };

  const downloadAsPDF = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('📄 Generating SINGLE-PAGE PDF with COMPLETE IMAGE CACHING (including CSS backgrounds)...');

      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(content, {
        scale: 2,
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
        onclone: async (clonedDoc, element) => {
          console.log('🎨 PRE-PROCESSING: Pre-loading and caching ALL images (including CSS backgrounds)...');
          
          // CRITICAL: Pre-load and cache ALL images (both <img> and CSS backgrounds)
          const imageCache = await preloadAndCacheAllImages(element);
          
          // Then replace ALL images with cached grayscale versions
          replaceAllImagesWithCachedVersions(element, imageCache);
          
          console.log('✅ ALL images (including CSS backgrounds) replaced with consistent cached grayscale versions!');
          
          // Apply comprehensive styling
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
            html, body, .newsletter-container, .newsletter, .newsletter-page {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            
            /* Ensure ALL images stay grayscale and maintain consistency */
            img {
              filter: none !important;
              -webkit-filter: none !important;
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
            
            /* Ensure ALL background images are properly handled and stay grayscale */
            * {
              background-size: cover !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
              filter: none !important;
              -webkit-filter: none !important;
            }
            
            .h-2\/3, .h-1\/3 {
              background-size: cover !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
            }
            
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .z-10 { z-index: 10 !important; }
            .z-20 { z-index: 20 !important; }
            .top-8 { top: 2rem !important; }
            .left-8 { left: 2rem !important; }
            .right-0 { right: 0 !important; }
            .top-0 { top: 0 !important; }
            .bottom-0 { bottom: 0 !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            .max-w-md { max-width: 28rem !important; }
            .inline-block { display: inline-block !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .mt-10 { margin-top: 2.5rem !important; }
            .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .font-medium { font-weight: 500 !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .whitespace-nowrap { white-space: nowrap !important; }
            
            .bg-red-700 h3, .bg-red-700 .text-white, .bg-red-700 * {
              color: #ffffff !important;
              opacity: 1 !important;
              visibility: visible !important;
              display: block !important;
            }
            
            * { opacity: 1 !important; }
          `;
          
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          // Apply additional styling to elements
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.removeProperty('color-scheme');
              
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
            }
          });
          
          // Special handling for red boxes
          const redBoxes = element.querySelectorAll('.bg-red-700');
          redBoxes.forEach((box) => {
            if (box instanceof HTMLElement) {
              box.style.setProperty('background-color', '#b91c1c', 'important');
              box.style.setProperty('color', '#ffffff', 'important');
              
              const textElements = box.querySelectorAll('*');
              textElements.forEach((textEl) => {
                if (textEl instanceof HTMLElement) {
                  textEl.style.setProperty('color', '#ffffff', 'important');
                  textEl.style.setProperty('opacity', '1', 'important');
                  textEl.style.setProperty('visibility', 'visible', 'important');
                  textEl.style.setProperty('display', 'block', 'important');
                  
                  if (textEl.tagName === 'H3') {
                    textEl.style.setProperty('font-size', '1.125rem', 'important');
                    textEl.style.setProperty('font-weight', '500', 'important');
                    textEl.style.setProperty('line-height', '1.75rem', 'important');
                    textEl.style.setProperty('white-space', 'nowrap', 'important');
                  }
                }
              });
            }
          });
          
          console.log('✅ Comprehensive styling applied with complete image caching (including CSS backgrounds)');
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
      
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / canvasAspectRatio;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * canvasAspectRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      console.log(`📄 Fitting entire newsletter on single page:`);
      console.log(`   Canvas: ${canvas.width}x${canvas.height} (ratio: ${canvasAspectRatio.toFixed(2)})`);
      console.log(`   PDF: ${pdfWidth}x${pdfHeight}mm (ratio: ${pdfAspectRatio.toFixed(2)})`);
      console.log(`   Final size: ${finalWidth.toFixed(1)}x${finalHeight.toFixed(1)}mm`);
      console.log(`   Position: x=${xOffset.toFixed(1)}mm, y=${yOffset.toFixed(1)}mm`);

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

      pdf.save('Cybersecurity-Newsletter-SinglePage.pdf');
      console.log('🎉 SINGLE-PAGE PDF generated with COMPLETE IMAGE CACHING (including CSS backgrounds)!');

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
      console.log('🖼️ Generating PNG with COMPLETE IMAGE CACHING (including CSS backgrounds)...');

      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(content, {
        scale: 2,
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
        onclone: async (clonedDoc, element) => {
          console.log('🎨 PRE-PROCESSING PNG: Pre-loading and caching ALL images (including CSS backgrounds)...');
          
          // Pre-load and cache ALL images (both <img> and CSS backgrounds)
          const imageCache = await preloadAndCacheAllImages(element);
          
          // Then replace ALL images with cached grayscale versions
          replaceAllImagesWithCachedVersions(element, imageCache);
          
          console.log('✅ ALL images (including CSS backgrounds) replaced with consistent cached grayscale versions for PNG!');
          
          const comprehensiveStyle = clonedDoc.createElement('style');
          comprehensiveStyle.textContent = `
            html, body, .newsletter-container, .newsletter, .newsletter-page {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            
            img {
              filter: none !important;
              -webkit-filter: none !important;
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
            
            * {
              background-size: cover !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
              filter: none !important;
              -webkit-filter: none !important;
            }
            
            .h-2\/3, .h-1\/3 {
              background-size: cover !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
            }
            
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .z-10 { z-index: 10 !important; }
            .z-20 { z-index: 20 !important; }
            .top-8 { top: 2rem !important; }
            .left-8 { left: 2rem !important; }
            .right-0 { right: 0 !important; }
            .top-0 { top: 0 !important; }
            .bottom-0 { bottom: 0 !important; }
            .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
            .max-w-md { max-width: 28rem !important; }
            .inline-block { display: inline-block !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .mt-10 { margin-top: 2.5rem !important; }
            .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .font-medium { font-weight: 500 !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .whitespace-nowrap { white-space: nowrap !important; }
            .bg-red-700 h3, .bg-red-700 .text-white, .bg-red-700 * { 
              color: #ffffff !important; 
              opacity: 1 !important; 
              visibility: visible !important; 
              display: block !important; 
            }
            * { opacity: 1 !important; }
          `;
          clonedDoc.head.appendChild(comprehensiveStyle);
          
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.removeProperty('color-scheme');
              
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
            }
          });
          
          const redBoxes = element.querySelectorAll('.bg-red-700');
          redBoxes.forEach((box) => {
            if (box instanceof HTMLElement) {
              box.style.setProperty('background-color', '#b91c1c', 'important');
              box.style.setProperty('color', '#ffffff', 'important');
              
              const textElements = box.querySelectorAll('*');
              textElements.forEach((textEl) => {
                if (textEl instanceof HTMLElement) {
                  textEl.style.setProperty('color', '#ffffff', 'important');
                  textEl.style.setProperty('opacity', '1', 'important');
                  textEl.style.setProperty('visibility', 'visible', 'important');
                  textEl.style.setProperty('display', 'block', 'important');
                  
                  if (textEl.tagName === 'H3') {
                    textEl.style.setProperty('font-size', '1.125rem', 'important');
                    textEl.style.setProperty('font-weight', '500', 'important');
                    textEl.style.setProperty('line-height', '1.75rem', 'important');
                    textEl.style.setProperty('white-space', 'nowrap', 'important');
                  }
                }
              });
            }
          });
          
          console.log('✅ Comprehensive styling for PNG applied with complete image caching');
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

      console.log('🎉 PNG generated with COMPLETE IMAGE CACHING (including CSS backgrounds)!');

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
                  📄 Download as Single-Page PDF
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