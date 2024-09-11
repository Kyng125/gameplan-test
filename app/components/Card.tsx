import React, { useState } from "react";
import styles from "../components/styles/Background.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard"; // Import the copy to clipboard library
import { FaCopy, FaCheck } from "react-icons/fa"; // Import icons for copy and check

interface CardProps {
  onClick?: () => void;
  className?: string;
  title: React.ReactNode;
  metrics?: React.ReactNode;
  icon?: React.ReactNode;
  buttonText?: React.ReactNode;
  width?: string;
  referralCode?: string; // Add the referralCode prop
  link?: React.ReactNode;
  disabled?: boolean; 
}

const Card: React.FC<CardProps> = ({
  onClick,
  className,
  title,
  metrics,
  icon,
  buttonText,
  width,
  referralCode,
  link,
  disabled, // Destructure disabled prop
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <div className={`${styles.card} ${width} relative text-customGold text-3xl mt-10 ml-5 max-w-72 shadow-lg shadow-black uppercase border border-customGold rounded-3xl p-6 flex flex-col items-center bg-base-300`}>
      {icon}
      {title}
      {metrics || <div className="p-10"></div>}
      {referralCode && (
        <div className="flex items-center gap-2 mt-4 border border-customGold  rounded-box p-3 shadow-md shadow-black font-extrabold">
          <span className="text-sm mr-2">{referralCode}</span>
          <CopyToClipboard text={referralCode} onCopy={handleCopy}>
            <button className="focus:outline-none">
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-white" />}
            </button>
          </CopyToClipboard>
        </div>
      )}
      <button className={className} onClick={onClick}  disabled={disabled}>
        {buttonText}
      </button>
    </div>
  );
};

export default Card;
