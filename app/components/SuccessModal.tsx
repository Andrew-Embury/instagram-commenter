import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 flex flex-col items-center'>
        <CheckCircle className='text-green-500 w-16 h-16 mb-4' />
        <p className='text-lg font-semibold mb-4'>
          Comment Posted Successfully!
        </p>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
