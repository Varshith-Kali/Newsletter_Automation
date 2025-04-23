import React from 'react';
import { Printer } from 'lucide-react';

const PrintButton: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="fixed bottom-4 right-4 print:hidden bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      aria-label="Print newsletter"
    >
      <Printer size={24} />
    </button>
  );
};

export default PrintButton;