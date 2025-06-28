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
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      if (ctx) {
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
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
      }
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png', 1.0));
    });
  };

  // Function to replace ONLY images with grayscale versions
  const replaceImagesWithGrayscale = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll('img');
    const promises: Promise<void>[] = [];
    
    images.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        const promise = new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            // Image is already loaded
            convertImageToGrayscale(img).then((grayscaleDataUrl) => {
              img.src = grayscaleDataUrl;
              img.style.filter = 'none'; // Remove any existing filters
              resolve();
            });
          } else {
            // Wait for image to load
            const handleLoad = () => {
              convertImageToGrayscale(img).then((grayscaleDataUrl) => {
                img.src = grayscaleDataUrl;
                img.style.filter = 'none';
                resolve();
              });
            };
            
            const handleError = () => {
              console.warn('Failed to load image:', img.src);
              resolve();
            };
            
            img.addEventListener('load', handleLoad, { once: true });
            img.addEventListener('error', handleError, { once: true });
          }
        });
        
        promises.push(promise);
      }
    });
    
    await Promise.all(promises);
  };

  const downloadAsPDF = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('📄 Generating SINGLE-PAGE PDF with SELECTIVE GRAYSCALE (images only)...');

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
          console.log('🎨 SELECTIVE PROCESSING: Converting ONLY images to grayscale...');
          
          // ONLY convert images to grayscale - preserve all other colors
          await replaceImagesWithGrayscale(element);
          
          console.log('✅ Images converted to grayscale - ALL OTHER COLORS PRESERVED!');
          
          // Apply MINIMAL styling - ONLY to preserve existing appearance
          const minimalStyle = clonedDoc.createElement('style');
          minimalStyle.textContent = `
            /* PRESERVE ALL EXISTING COLORS - only ensure no additional filters on images */
            img {
              filter: none !important;
              -webkit-filter: none !important;
            }
            
            /* Ensure all existing styles are preserved exactly as in preview */
            * {
              box-sizing: border-box !important;
            }
            
            /* Preserve all background colors exactly as they are */
            .bg-red-700 { 
              background-color: #b91c1c !important; 
              color: #ffffff !important; 
            }
            .bg-black { 
              background-color: #000000 !important; 
              color: #ffffff !important; 
            }
            .bg-white { 
              background-color: #ffffff !important; 
              color: #000000 !important; 
            }
            .bg-gray-50 { 
              background-color: #f9fafb !important; 
            }
            .bg-gray-100 { 
              background-color: #f3f4f6 !important; 
            }
            
            /* Preserve all text colors exactly as they are */
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-red-800 { color: #991b1b !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-blue-800 { color: #1e40af !important; }
            .text-blue-600 { color: #2563eb !important; }
            .text-orange-800 { color: #9a3412 !important; }
            .text-yellow-800 { color: #92400e !important; }
            .text-green-800 { color: #166534 !important; }
            
            /* Preserve all border colors */
            .border-red-300 { border-color: #fca5a5 !important; }
            .border-orange-300 { border-color: #fdba74 !important; }
            .border-yellow-300 { border-color: #fcd34d !important; }
            .border-green-300 { border-color: #86efac !important; }
            .border-gray-300 { border-color: #d1d5db !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .border-blue-300 { border-color: #93c5fd !important; }
            
            /* Preserve all background colors for badges and elements */
            .bg-red-100 { background-color: #fee2e2 !important; }
            .bg-orange-100 { background-color: #ffedd5 !important; }
            .bg-yellow-100 { background-color: #fef3c7 !important; }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .bg-blue-100 { background-color: #dbeafe !important; }
            .bg-red-600 { background-color: #dc2626 !important; }
            
            /* Ensure proper positioning and layout */
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .z-10 { z-index: 10 !important; }
            .z-20 { z-index: 20 !important; }
            
            /* Preserve opacity settings */
            .opacity-60 { opacity: 0.6 !important; }
            
            /* Ensure all elements are visible */
            * { 
              visibility: visible !important;
              display: block !important;
            }
            
            /* Inline elements should remain inline */
            span, a, strong, em, code { display: inline !important; }
            .inline-block { display: inline-block !important; }
            .flex { display: flex !important; }
            .grid { display: grid !important; }
          `;
          
          clonedDoc.head.appendChild(minimalStyle);
          
          console.log('✅ SELECTIVE styling applied - images grayscale, everything else preserved!');
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
      console.log('🎉 SINGLE-PAGE PDF with SELECTIVE GRAYSCALE generated successfully!');

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
      console.log('🖼️ Generating PNG with SELECTIVE GRAYSCALE (images only)...');

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
          console.log('🎨 SELECTIVE PNG PROCESSING: Converting ONLY images to grayscale...');
          
          // ONLY convert images to grayscale - preserve all other colors
          await replaceImagesWithGrayscale(element);
          
          console.log('✅ Images converted to grayscale for PNG - ALL OTHER COLORS PRESERVED!');
          
          // Apply same minimal styling as PDF
          const minimalStyle = clonedDoc.createElement('style');
          minimalStyle.textContent = `
            img {
              filter: none !important;
              -webkit-filter: none !important;
            }
            
            * {
              box-sizing: border-box !important;
            }
            
            .bg-red-700 { background-color: #b91c1c !important; color: #ffffff !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .bg-white { background-color: #ffffff !important; color: #000000 !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            
            .text-white { color: #ffffff !important; }
            .text-black { color: #000000 !important; }
            .text-red-700 { color: #b91c1c !important; }
            .text-red-800 { color: #991b1b !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-blue-800 { color: #1e40af !important; }
            .text-blue-600 { color: #2563eb !important; }
            .text-orange-800 { color: #9a3412 !important; }
            .text-yellow-800 { color: #92400e !important; }
            .text-green-800 { color: #166534 !important; }
            
            .border-red-300 { border-color: #fca5a5 !important; }
            .border-orange-300 { border-color: #fdba74 !important; }
            .border-yellow-300 { border-color: #fcd34d !important; }
            .border-green-300 { border-color: #86efac !important; }
            .border-gray-300 { border-color: #d1d5db !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .border-blue-300 { border-color: #93c5fd !important; }
            
            .bg-red-100 { background-color: #fee2e2 !important; }
            .bg-orange-100 { background-color: #ffedd5 !important; }
            .bg-yellow-100 { background-color: #fef3c7 !important; }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .bg-blue-100 { background-color: #dbeafe !important; }
            .bg-red-600 { background-color: #dc2626 !important; }
            
            .min-h-screen { min-height: 100vh !important; }
            .h-screen { height: 100vh !important; }
            .absolute { position: absolute !important; }
            .relative { position: relative !important; }
            .z-10 { z-index: 10 !important; }
            .z-20 { z-index: 20 !important; }
            .opacity-60 { opacity: 0.6 !important; }
            
            * { 
              visibility: visible !important;
              display: block !important;
            }
            
            span, a, strong, em, code { display: inline !important; }
            .inline-block { display: inline-block !important; }
            .flex { display: flex !important; }
            .grid { display: grid !important; }
          `;
          clonedDoc.head.appendChild(minimalStyle);
          
          console.log('✅ SELECTIVE PNG styling applied - images grayscale, everything else preserved!');
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

      console.log('🎉 PNG with SELECTIVE GRAYSCALE generated successfully!');

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