import React, { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

const ConnectTwitterModal = ({
  isVisible,
  onClose,
  onSuccess,
  onFailure
}: Props) => {
  const handleConnect = async () => {
    try {
      // Replace with actual Twitter/X authentication logic
      const isAuthenticated = true; // Mock authentication result
      if (isAuthenticated) {
        onSuccess();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      onFailure((error as Error).message);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold"
      content={
        <div className="flex flex-col items-center">
          <Image
            src="/xdazzle.svg"
            alt="Twitter/X"
            width={80}
            height={80}
          />
          <button
            className="btn btn-glass rounded-box bg-customGold text-black hover:bg-customGold hover:text-white duration-300 mt-5"
            onClick={handleConnect}
          >
            Connect X
          </button>
        </div>
      }
    />
  );
};

export default ConnectTwitterModal;
