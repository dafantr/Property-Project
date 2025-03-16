'use client';
import { X } from 'lucide-react';

interface TermsModalProps {
  setShowTermsModal: (showTermsModal: boolean) => void;
}

export default function TermsModal({ setShowTermsModal }: TermsModalProps) {
  
  const onBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
		  setShowTermsModal(false);
		}
	};
  return (
  // Backdrop - removed nested fixed div
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
    onClick={onBackdropClick}
  >
    {/* Modal */}
    <div 
      className="relative w-full max-w-2xl max-h-[90vh] m-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching backdrop
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          MDV Villas Exclusive Membership <br /> Terms and Conditions
        </h3>
        <button
          onClick={() => setShowTermsModal(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose dark:prose-invert max-w-none">
            <h4 className="text-lg font-bold mb-2">1. Introduction</h4>
            <p className="mb-4">Welcome to MDV Vilas Next Step Membership Program...</p>

            <h4 className="text-lg font-bold mb-2">2. Membership Terms</h4>
            <p className="mb-4">By becoming a member, you agree to...</p>

            <h4 className="text-lg font-bold mb-2">3. Privacy Policy</h4>
            <p className="mb-4">We take your privacy seriously...</p>
          </div>
        </div>
      </div>
    </div>
  );
}