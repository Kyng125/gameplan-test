import React from "react";

interface ModalProps {
  content: React.ReactNode;
  onClose: () => void;
  className?: string;
  isVisible?: boolean;
}

const Modal: React.FC<ModalProps> = ({ content, onClose, className, isVisible }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div
        className={`relative p-6 bg-base-300 rounded-box border text-white  max-w-3xl w-full mx-4 md:w-1/2 ${className}`}
      >
        <button
          className="absolute top-2 right-2 text-customGold"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
