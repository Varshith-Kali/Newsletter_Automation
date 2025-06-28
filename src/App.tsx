import React, { useRef } from 'react';
import NewsletterEditor from './components/NewsletterEditor';
import Newsletter from './components/Newsletter';
import { NewsletterProvider } from './context/NewsletterContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const printRef = useRef<HTMLDivElement>(null);

  const convertCanvasToGrayscale = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    console.log('🎨 ULTIMATE GRAYSCALE: Converting canvas pixels directly...');
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('⚠️ Could not get canvas context');
      return canvas;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      
      const grayscale = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
      
      data[i] = grayscale;
      data[i + 1] = grayscale;
      data[i + 2] = grayscale;
    }

    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ ULTIMATE GRAYSCALE: Canvas pixels converted to grayscale!');
    return canvas;
  };

  const downloadAsPDF = async () => {
    const content = printRef.current;
    if (!content) {
      alert('Newsletter content not found');
      return;
    }

    try {
      console.log('📄 Generating SINGLE-PAGE PDF with ULTIMATE GRAYSCALE...');

      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      let canvas = await html2canvas(content, {
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
        onclone: (clonedDoc, element) => {
          console.log('🎨 APPLYING COMPREHENSIVE STYLING...');
          
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
          
          console.log('✅ Comprehensive styling applied');
        }
      });

      console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      canvas = convertCanvasToGrayscale(canvas);

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
      console.log('🎉 SINGLE-PAGE PDF generated with ULTIMATE GRAYSCALE!');

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
      console.log('🖼️ Generating PNG with ULTIMATE GRAYSCALE...');

      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      let canvas = await html2canvas(content, {
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
        onclone: (clonedDoc, element) => {
          console.log('🎨 APPLYING COMPREHENSIVE STYLING FOR PNG...');
          
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
          
          console.log('✅ Comprehensive styling for PNG applied');
        }
      });

      console.log(`📸 PNG canvas: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      canvas = convertCanvasToGrayscale(canvas);

      const link = document.createElement('a');
      link.download = 'Cybersecurity-Newsletter.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('🎉 PNG generated with ULTIMATE GRAYSCALE!');

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