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
      console.log('📄 Generating PDF with exact preview styling...');
      
      // Simple preparation - just ensure visibility
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use minimal canvas options to preserve existing styling
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff', // White background instead of null
        logging: false,
        width: content.offsetWidth,
        height: content.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false, // Use standard rendering
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        // Enhanced onclone to ensure proper grayscale
        onclone: (clonedDoc, element) => {
          console.log('🎨 Applying grayscale to images...');
          
          // Add comprehensive grayscale styles
          const grayscaleStyle = clonedDoc.createElement('style');
          grayscaleStyle.textContent = `
            /* Force grayscale on ALL images with maximum specificity */
            img, 
            .newsletter-cover img,
            .newsletter-threats img,
            .newsletter-best-practices img {
              filter: grayscale(100%) brightness(1) contrast(1) !important;
              -webkit-filter: grayscale(100%) brightness(1) contrast(1) !important;
            }
            
            /* Ensure opacity is preserved */
            .opacity-60 {
              opacity: 0.6 !important;
            }
            
            /* Ensure all existing classes work */
            .grayscale {
              filter: grayscale(100%) !important;
              -webkit-filter: grayscale(100%) !important;
            }
          `;
          
          clonedDoc.head.appendChild(grayscaleStyle);
          
          // Force grayscale on every single image element
          const allImages = element.querySelectorAll('img');
          console.log(`🖼️ Found ${allImages.length} images to convert to grayscale`);
          
          allImages.forEach((img, index) => {
            if (img instanceof HTMLElement) {
              console.log(`Converting image ${index + 1} to grayscale`);
              
              // Apply multiple methods to ensure grayscale
              img.style.setProperty('filter', 'grayscale(100%) brightness(1) contrast(1)', 'important');
              img.style.setProperty('-webkit-filter', 'grayscale(100%) brightness(1) contrast(1)', 'important');
              
              // Add grayscale class
              img.classList.add('grayscale');
              
              // Set inline style as backup
              img.setAttribute('style', 
                (img.getAttribute('style') || '') + 
                '; filter: grayscale(100%) brightness(1) contrast(1) !important; -webkit-filter: grayscale(100%) brightness(1) contrast(1) !important;'
              );
            }
          });
          
          console.log('✅ Grayscale applied to all images');
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
      console.log('🎉 PDF generated successfully with grayscale images!');
      
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
      console.log('🖼️ Generating PNG with exact preview styling...');
      
      // Simple preparation
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use same enhanced approach as PDF
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
        imageTimeout: 10000,
        removeContainer: false,
        ignoreElements: () => false,
        onclone: (clonedDoc, element) => {
          console.log('🎨 Applying grayscale to images...');
          
          // Same comprehensive grayscale approach as PDF
          const grayscaleStyle = clonedDoc.createElement('style');
          grayscaleStyle.textContent = `
            img, 
            .newsletter-cover img,
            .newsletter-threats img,
            .newsletter-best-practices img {
              filter: grayscale(100%) brightness(1) contrast(1) !important;
              -webkit-filter: grayscale(100%) brightness(1) contrast(1) !important;
            }
            
            .opacity-60 {
              opacity: 0.6 !important;
            }
            
            .grayscale {
              filter: grayscale(100%) !important;
              -webkit-filter: grayscale(100%) !important;
            }
          `;
          clonedDoc.head.appendChild(grayscaleStyle);
          
          const allImages = element.querySelectorAll('img');
          console.log(`🖼️ Found ${allImages.length} images to convert to grayscale`);
          
          allImages.forEach((img, index) => {
            if (img instanceof HTMLElement) {
              console.log(`Converting image ${index + 1} to grayscale`);
              
              img.style.setProperty('filter', 'grayscale(100%) brightness(1) contrast(1)', 'important');
              img.style.setProperty('-webkit-filter', 'grayscale(100%) brightness(1) contrast(1)', 'important');
              img.classList.add('grayscale');
              
              img.setAttribute('style', 
                (img.getAttribute('style') || '') + 
                '; filter: grayscale(100%) brightness(1) contrast(1) !important; -webkit-filter: grayscale(100%) brightness(1) contrast(1) !important;'
              );
            }
          });
          
          console.log('✅ Grayscale applied to all images');
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
      
      console.log('🎉 PNG generated successfully with grayscale images!');
      
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