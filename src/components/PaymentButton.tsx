import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import DonationModal from './DonationModal';
import ReactGA from 'react-ga4';

interface DonationButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  showIcon?: boolean;
}

const DonationButton: React.FC<DonationButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  text = 'Liked What You Saw?',
  showIcon = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    ReactGA.event({
      action: 'donation_button_click',
      category: 'engagement',
      label: text,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Base styles
  const baseStyles = "font-medium transition-colors rounded-lg flex items-center justify-center";
  
  // Size styles
  const sizeStyles = {
    sm: "text-sm py-2 px-3",
    md: "py-2 px-4",
    lg: "text-lg py-3 px-6",
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-yellow-700 hover:bg-yellow-800 text-white",
    secondary: "bg-gray-800/50 hover:bg-gray-800/70 text-white",
    text: "text-yellow-500 hover:text-yellow-400",
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      >
        {showIcon && <Heart className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${size === 'sm' ? 'mr-1' : 'mr-2'}`} />}
        {text}
      </button>
      
      <DonationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default DonationButton;
