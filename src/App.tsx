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
      console.log('📄 Generating SINGLE-PAGE PDF with ULTRA-AGGRESSIVE grayscale...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // ULTRA-AGGRESSIVE APPROACH: Force grayscale at multiple levels
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
        onclone: (clonedDoc, element) => {
          console.log('🎨 APPLYING NUCLEAR-LEVEL GRAYSCALE ENFORCEMENT...');
          
          // STEP 1: INJECT ULTRA-AGGRESSIVE CSS
          const nuclearGrayscaleStyle = clonedDoc.createElement('style');
          nuclearGrayscaleStyle.textContent = `
            /* NUCLEAR GRAYSCALE - EVERY POSSIBLE SELECTOR */
            img,
            img[src],
            img[src*="pexels"],
            img[src*="https"],
            img[crossorigin],
            .newsletter img,
            .newsletter-page img,
            .newsletter-cover img,
            .newsletter-threats img,
            .newsletter-best-practices img,
            div img,
            section img,
            article img,
            * img,
            [role="img"],
            picture img,
            figure img {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -moz-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -ms-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -o-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              opacity: 1 !important;
              mix-blend-mode: luminosity !important;
              -webkit-mix-blend-mode: luminosity !important;
              background-blend-mode: luminosity !important;
              isolation: isolate !important;
            }
            
            /* FORCE GRAYSCALE ON BACKGROUND IMAGES */
            [style*="background-image"],
            .bg-cover,
            .bg-center,
            .object-cover {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
            }
            
            /* ADDITIONAL GRAYSCALE CLASSES */
            .force-grayscale,
            .grayscale-forced,
            .no-color {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -moz-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -ms-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -o-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              mix-blend-mode: luminosity !important;
            }
            
            /* FORCE LIGHT THEME */
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              color-scheme: light !important;
            }
            
            /* EXACT COLOR ENFORCEMENT */
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
            
            .text-white {
              color: #ffffff !important;
            }
            
            .text-black {
              color: #000000 !important;
            }
            
            .text-red-700 {
              color: #b91c1c !important;
            }
            
            .text-gray-700 {
              color: #374151 !important;
            }
            
            .text-gray-600 {
              color: #4b5563 !important;
            }
            
            .text-gray-500 {
              color: #6b7280 !important;
            }
            
            /* LAYOUT FIXES */
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
            
            /* FORCE TEXT VISIBILITY IN RED BOXES */
            .bg-red-700 h3,
            .bg-red-700 .text-white,
            .bg-red-700 * {
              color: #ffffff !important;
              opacity: 1 !important;
              visibility: visible !important;
              display: block !important;
            }
            
            /* REMOVE ANY DARK THEME OVERRIDES */
            * {
              opacity: 1 !important;
            }
            
            /* ENSURE NEWSLETTER CONTAINER IS WHITE */
            .newsletter-container,
            .newsletter,
            .newsletter-page {
              background-color: #ffffff !important;
            }
            
            /* OPACITY CLASSES */
            .opacity-60 {
              opacity: 0.6 !important;
            }
            
            /* WHITE SPACE HANDLING */
            .whitespace-nowrap {
              white-space: nowrap !important;
            }
          `;
          
          clonedDoc.head.appendChild(nuclearGrayscaleStyle);
          
          // STEP 2: NUCLEAR IMAGE PROCESSING
          const allImages = element.querySelectorAll('img');
          console.log(`🔍 Found ${allImages.length} images for NUCLEAR grayscale treatment`);
          
          allImages.forEach((img, index) => {
            if (img instanceof HTMLElement) {
              console.log(`💥 NUCLEAR processing image ${index + 1}: ${img.src}`);
              
              // METHOD 1: Multiple filter properties with extreme values
              const nuclearFilter = 'grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg)';
              img.style.setProperty('filter', nuclearFilter, 'important');
              img.style.setProperty('-webkit-filter', nuclearFilter, 'important');
              img.style.setProperty('-moz-filter', nuclearFilter, 'important');
              img.style.setProperty('-ms-filter', nuclearFilter, 'important');
              img.style.setProperty('-o-filter', nuclearFilter, 'important');
              
              // METHOD 2: Mix blend modes
              img.style.setProperty('mix-blend-mode', 'luminosity', 'important');
              img.style.setProperty('-webkit-mix-blend-mode', 'luminosity', 'important');
              img.style.setProperty('background-blend-mode', 'luminosity', 'important');
              img.style.setProperty('isolation', 'isolate', 'important');
              
              // METHOD 3: Direct style attribute manipulation (NUCLEAR LEVEL)
              const currentStyle = img.getAttribute('style') || '';
              const nuclearStyleString = `${currentStyle}; filter: ${nuclearFilter} !important; -webkit-filter: ${nuclearFilter} !important; mix-blend-mode: luminosity !important; background-blend-mode: luminosity !important; isolation: isolate !important;`;
              img.setAttribute('style', nuclearStyleString);
              
              // METHOD 4: Add multiple CSS classes
              img.classList.add('force-grayscale', 'grayscale-forced', 'no-color');
              
              // METHOD 5: Set CSS custom properties
              img.style.setProperty('--grayscale', '100%');
              img.style.setProperty('--saturation', '0%');
              img.style.setProperty('--contrast', '1.3');
              img.style.setProperty('--brightness', '0.8');
              
              // METHOD 6: Force opacity and visibility
              img.style.setProperty('opacity', '1', 'important');
              img.style.setProperty('visibility', 'visible', 'important');
              
              // METHOD 7: Remove any color-related attributes
              img.removeAttribute('color');
              img.removeAttribute('tintColor');
              
              // METHOD 8: Set data attributes for tracking
              img.setAttribute('data-grayscale-forced', 'true');
              img.setAttribute('data-original-filter', img.style.filter || 'none');
              
              console.log(`✅ Applied NUCLEAR grayscale methods to image ${index + 1}`);
            }
          });
          
          // STEP 3: HANDLE BACKGROUND IMAGES WITH NUCLEAR APPROACH
          const elementsWithBgImages = element.querySelectorAll('[style*="background-image"]');
          console.log(`🖼️ Found ${elementsWithBgImages.length} background images for NUCLEAR treatment`);
          
          elementsWithBgImages.forEach((el, index) => {
            if (el instanceof HTMLElement) {
              console.log(`💥 NUCLEAR processing background image ${index + 1}`);
              const nuclearBgFilter = 'grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%)';
              el.style.setProperty('filter', nuclearBgFilter, 'important');
              el.style.setProperty('-webkit-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-moz-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-ms-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-o-filter', nuclearBgFilter, 'important');
              el.setAttribute('data-bg-grayscale-forced', 'true');
            }
          });
          
          // STEP 4: COMPREHENSIVE ELEMENT STYLING (SAME AS BEFORE)
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
          
          // STEP 5: APPLY COMPREHENSIVE STYLING TO ALL ELEMENTS
          const allElements = element.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement && el.tagName !== 'IMG') {
              el.style.removeProperty('color-scheme');
              
              // Apply color classes
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
              
              // Apply positioning classes
              if (el.classList.contains('absolute')) {
                el.style.setProperty('position', 'absolute', 'important');
              }
              
              if (el.classList.contains('relative')) {
                el.style.setProperty('position', 'relative', 'important');
              }
              
              if (el.classList.contains('z-10')) {
                el.style.setProperty('z-index', '10', 'important');
              }
              
              if (el.classList.contains('z-20')) {
                el.style.setProperty('z-index', '20', 'important');
              }
              
              // Apply positioning values
              if (el.classList.contains('top-8')) {
                el.style.setProperty('top', '2rem', 'important');
              }
              
              if (el.classList.contains('left-8')) {
                el.style.setProperty('left', '2rem', 'important');
              }
              
              if (el.classList.contains('right-0')) {
                el.style.setProperty('right', '0', 'important');
              }
              
              if (el.classList.contains('top-0')) {
                el.style.setProperty('top', '0', 'important');
              }
              
              if (el.classList.contains('bottom-0')) {
                el.style.setProperty('bottom', '0', 'important');
              }
              
              if (el.classList.contains('inset-0')) {
                el.style.setProperty('top', '0', 'important');
                el.style.setProperty('right', '0', 'important');
                el.style.setProperty('bottom', '0', 'important');
                el.style.setProperty('left', '0', 'important');
              }
              
              // Apply sizing and spacing
              if (el.classList.contains('max-w-md')) {
                el.style.setProperty('max-width', '28rem', 'important');
              }
              
              if (el.classList.contains('inline-block')) {
                el.style.setProperty('display', 'inline-block', 'important');
              }
              
              if (el.classList.contains('py-2')) {
                el.style.setProperty('padding-top', '0.5rem', 'important');
                el.style.setProperty('padding-bottom', '0.5rem', 'important');
              }
              
              if (el.classList.contains('px-4')) {
                el.style.setProperty('padding-left', '1rem', 'important');
                el.style.setProperty('padding-right', '1rem', 'important');
              }
              
              if (el.classList.contains('mt-10')) {
                el.style.setProperty('margin-top', '2.5rem', 'important');
              }
              
              // Apply text styling
              if (el.classList.contains('text-lg')) {
                el.style.setProperty('font-size', '1.125rem', 'important');
                el.style.setProperty('line-height', '1.75rem', 'important');
              }
              
              if (el.classList.contains('font-medium')) {
                el.style.setProperty('font-weight', '500', 'important');
              }
            }
          });
          
          console.log(`🚀 NUCLEAR GRAYSCALE TREATMENT COMPLETE!`);
          console.log(`   - Processed ${allImages.length} regular images`);
          console.log(`   - Processed ${elementsWithBgImages.length} background images`);
          console.log(`   - Applied 8 different grayscale methods per image`);
          console.log(`   - Injected nuclear-level CSS rules`);
        }
      });

      console.log(`📸 Canvas created: ${canvas.width}x${canvas.height}`);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // 🎯 SINGLE PAGE PDF GENERATION
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      // Calculate scaling to fit entire content on one page
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider relative to its height than PDF
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / canvasAspectRatio;
      } else {
        // Canvas is taller relative to its width than PDF
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * canvasAspectRatio;
      }
      
      // Center the image on the page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      console.log(`📄 Fitting entire newsletter on single page:`);
      console.log(`   Canvas: ${canvas.width}x${canvas.height} (ratio: ${canvasAspectRatio.toFixed(2)})`);
      console.log(`   PDF: ${pdfWidth}x${pdfHeight}mm (ratio: ${pdfAspectRatio.toFixed(2)})`);
      console.log(`   Final size: ${finalWidth.toFixed(1)}x${finalHeight.toFixed(1)}mm`);
      console.log(`   Position: x=${xOffset.toFixed(1)}mm, y=${yOffset.toFixed(1)}mm`);

      // Add the entire newsletter as a single image on one page
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

      pdf.save('Cybersecurity-Newsletter-SinglePage.pdf');
      console.log('🎉 SINGLE-PAGE PDF generated with NUCLEAR GRAYSCALE!');

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
      console.log('🖼️ Generating PNG with NUCLEAR GRAYSCALE...');

      // Prepare for capture
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use same nuclear approach as PDF
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
        onclone: (clonedDoc, element) => {
          console.log('🎨 APPLYING NUCLEAR-LEVEL GRAYSCALE FOR PNG...');
          
          // Same nuclear CSS injection as PDF
          const nuclearGrayscaleStyle = clonedDoc.createElement('style');
          nuclearGrayscaleStyle.textContent = `
            /* NUCLEAR GRAYSCALE - EVERY POSSIBLE SELECTOR */
            img,
            img[src],
            img[src*="pexels"],
            img[src*="https"],
            img[crossorigin],
            .newsletter img,
            .newsletter-page img,
            .newsletter-cover img,
            .newsletter-threats img,
            .newsletter-best-practices img,
            div img,
            section img,
            article img,
            * img,
            [role="img"],
            picture img,
            figure img {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -moz-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -ms-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -o-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              opacity: 1 !important;
              mix-blend-mode: luminosity !important;
              -webkit-mix-blend-mode: luminosity !important;
              background-blend-mode: luminosity !important;
              isolation: isolate !important;
            }
            
            [style*="background-image"],
            .bg-cover,
            .bg-center,
            .object-cover {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) !important;
            }
            
            .force-grayscale,
            .grayscale-forced,
            .no-color {
              filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -webkit-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -moz-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -ms-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              -o-filter: grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg) !important;
              mix-blend-mode: luminosity !important;
            }
            
            html, body { background-color: #ffffff !important; color: #000000 !important; color-scheme: light !important; }
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
            .bg-red-700 h3, .bg-red-700 .text-white, .bg-red-700 * { 
              color: #ffffff !important; 
              opacity: 1 !important; 
              visibility: visible !important; 
              display: block !important; 
            }
            * { opacity: 1 !important; }
            .newsletter-container, .newsletter, .newsletter-page { background-color: #ffffff !important; }
            .opacity-60 { opacity: 0.6 !important; }
            .whitespace-nowrap { white-space: nowrap !important; }
          `;
          clonedDoc.head.appendChild(nuclearGrayscaleStyle);
          
          // Same nuclear image processing as PDF
          const allImages = element.querySelectorAll('img');
          console.log(`🔍 Found ${allImages.length} images for NUCLEAR grayscale treatment`);
          
          allImages.forEach((img, index) => {
            if (img instanceof HTMLElement) {
              console.log(`💥 NUCLEAR processing image ${index + 1}: ${img.src}`);
              
              const nuclearFilter = 'grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%) sepia(0%) hue-rotate(0deg)';
              img.style.setProperty('filter', nuclearFilter, 'important');
              img.style.setProperty('-webkit-filter', nuclearFilter, 'important');
              img.style.setProperty('-moz-filter', nuclearFilter, 'important');
              img.style.setProperty('-ms-filter', nuclearFilter, 'important');
              img.style.setProperty('-o-filter', nuclearFilter, 'important');
              
              img.style.setProperty('mix-blend-mode', 'luminosity', 'important');
              img.style.setProperty('-webkit-mix-blend-mode', 'luminosity', 'important');
              img.style.setProperty('background-blend-mode', 'luminosity', 'important');
              img.style.setProperty('isolation', 'isolate', 'important');
              
              const currentStyle = img.getAttribute('style') || '';
              const nuclearStyleString = `${currentStyle}; filter: ${nuclearFilter} !important; -webkit-filter: ${nuclearFilter} !important; mix-blend-mode: luminosity !important; background-blend-mode: luminosity !important; isolation: isolate !important;`;
              img.setAttribute('style', nuclearStyleString);
              
              img.classList.add('force-grayscale', 'grayscale-forced', 'no-color');
              
              img.style.setProperty('--grayscale', '100%');
              img.style.setProperty('--saturation', '0%');
              img.style.setProperty('--contrast', '1.3');
              img.style.setProperty('--brightness', '0.8');
              
              img.style.setProperty('opacity', '1', 'important');
              img.style.setProperty('visibility', 'visible', 'important');
              
              img.removeAttribute('color');
              img.removeAttribute('tintColor');
              
              img.setAttribute('data-grayscale-forced', 'true');
              img.setAttribute('data-original-filter', img.style.filter || 'none');
              
              console.log(`✅ Applied NUCLEAR grayscale methods to image ${index + 1}`);
            }
          });
          
          // Same background image processing as PDF
          const elementsWithBgImages = element.querySelectorAll('[style*="background-image"]');
          console.log(`🖼️ Found ${elementsWithBgImages.length} background images for NUCLEAR treatment`);
          
          elementsWithBgImages.forEach((el, index) => {
            if (el instanceof HTMLElement) {
              console.log(`💥 NUCLEAR processing background image ${index + 1}`);
              const nuclearBgFilter = 'grayscale(100%) contrast(1.3) brightness(0.8) saturate(0%)';
              el.style.setProperty('filter', nuclearBgFilter, 'important');
              el.style.setProperty('-webkit-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-moz-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-ms-filter', nuclearBgFilter, 'important');
              el.style.setProperty('-o-filter', nuclearBgFilter, 'important');
              el.setAttribute('data-bg-grayscale-forced', 'true');
            }
          });
          
          // Same comprehensive styling as PDF (abbreviated for space)
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
          
          console.log(`🚀 NUCLEAR GRAYSCALE TREATMENT FOR PNG COMPLETE!`);
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

      console.log('🎉 PNG generated with NUCLEAR GRAYSCALE!');

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