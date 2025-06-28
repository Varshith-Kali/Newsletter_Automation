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
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
          // Alpha channel (data[i + 3]) remains unchanged
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      resolve(canvas.toDataURL('image/png'));
    });
  };

  const downloadAsPDF = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('📄 Generating PDF with FORCED grayscale images...');
      
      // Prepare the content
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pre-process all images to grayscale BEFORE canvas capture
      const allImages = content.querySelectorAll('img');
      console.log(`🖼️ Converting ${allImages.length} images to grayscale...`);
      
      const imagePromises = Array.from(allImages).map(async (img) => {
        if (img instanceof HTMLImageElement) {
          try {
            // Wait for image to load if not already loaded
            if (!img.complete) {
              await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            }
            
            // Convert to grayscale
            const grayscaleDataUrl = await convertImageToGrayscale(img);
            
            // Store original src and replace with grayscale version
            img.dataset.originalSrc = img.src;
            img.src = grayscaleDataUrl;
            
            console.log('✅ Image converted to grayscale');
          } catch (error) {
            console.warn('⚠️ Failed to convert image:', error);
          }
        }
      });
      
      // Wait for all images to be converted
      await Promise.all(imagePromises);
      
      // Additional wait to ensure DOM updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now capture with html2canvas
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
        ignoreElements: () => false
      });

      console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

      // Restore original images after capture
      allImages.forEach((img) => {
        if (img instanceof HTMLImageElement && img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
          delete img.dataset.originalSrc;
        }
      });

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
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('Cybersecurity-Newsletter.pdf');
      console.log('🎉 PDF generated successfully with FORCED grayscale images!');
      
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
      console.log('🖼️ Generating PNG with FORCED grayscale images...');
      
      // Prepare the content
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pre-process all images to grayscale BEFORE canvas capture
      const allImages = content.querySelectorAll('img');
      console.log(`🖼️ Converting ${allImages.length} images to grayscale...`);
      
      const imagePromises = Array.from(allImages).map(async (img) => {
        if (img instanceof HTMLImageElement) {
          try {
            // Wait for image to load if not already loaded
            if (!img.complete) {
              await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            }
            
            // Convert to grayscale
            const grayscaleDataUrl = await convertImageToGrayscale(img);
            
            // Store original src and replace with grayscale version
            img.dataset.originalSrc = img.src;
            img.src = grayscaleDataUrl;
            
            console.log('✅ Image converted to grayscale');
          } catch (error) {
            console.warn('⚠️ Failed to convert image:', error);
          }
        }
      });
      
      // Wait for all images to be converted
      await Promise.all(imagePromises);
      
      // Additional wait to ensure DOM updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now capture with html2canvas
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
        ignoreElements: () => false
      });

      console.log(`📸 PNG canvas: ${canvas.width}x${canvas.height}`);

      // Restore original images after capture
      allImages.forEach((img) => {
        if (img instanceof HTMLImageElement && img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
          delete img.dataset.originalSrc;
        }
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🎉 PNG generated successfully with FORCED grayscale images!');
      
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