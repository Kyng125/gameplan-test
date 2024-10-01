"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ThirdwebProvider,
  useMetamask,
  useAddress,
  useContract
} from "@thirdweb-dev/react"; // Correct Thirdweb imports
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Adjust the path if necessary
import Modal from "./Modal";

// Polygon NFT collection configuration
const NFT_COLLECTION_ADDRESS = "0xB098055b534e282b482144a677A63cA658063c6F"; // Contract address

const generateReferralCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const ConnectWallet = () => {
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Thirdweb hooks
  const connectWithMetamask = useMetamask(); // Connect to MetaMask
  const address = useAddress(); // Get the connected wallet address
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  ); // NFT Collection contract

  useEffect(() => {
    if (address) {
      checkNFTOwnership(address);
    }
  }, [address]);

  const handleConnectWallet = () => {
    console.log("Connect Wallet button clicked");
    setIsWalletModalVisible(true);
  };

  const handleWalletClick = async () => {
    try {
      console.log("Attempting wallet connection...");
      setIsWalletModalVisible(false);
  
      // Check if MetaMask (or other Ethereum wallet) is installed
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install it to use this app.");
        return;
      }
  
      // Request wallet connection through MetaMask
      try {
        await connectWithMetamask();
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Handle if the user denies the connection request
          if ((error as any).code === 4001) { // MetaMask specific error code
            console.log("User denied account access");
            setErrorMessage("User denied account access");
            return;
          } else {
            throw error;
          }
        }
      }
  
      // Fetch the current network using net_version (more reliable)
      const networkVersion = await window.ethereum.request({ method: 'net_version' });
  
      // Check if connected to Polygon network (network ID 137)
      if (networkVersion !== "137") {
        alert("Please switch to the Polygon network!");
        return;
      }
  
      // Once connected, retrieve the user's address and check NFT ownership
      if (address) {
        console.log("Wallet connected with address:", address);
        
        const ownsNFT = await checkNFTOwnership(address);
        if (ownsNFT) {
          await saveWalletAddress(address);
          setIsSuccessful(true);
        } else {
          throw new Error("NFT ownership verification failed");
        }
      } else {
        throw new Error("Wallet connection failed or no account found.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during wallet connection:", error.message);
        setErrorMessage(error.message);
      } else {
        console.error("Unknown error during wallet connection:", error);
        setErrorMessage("An unknown error occurred during wallet connection.");
      }
      setIsSuccessful(false);
    }
  
    setIsResultModalVisible(true);
  };
  
  

  useEffect(() => {
    if (isSuccessful) {
      setTimeout(() => {
        router.push("/quests");
      }, 3000);
    }
  }, [isSuccessful, router]);

  const handleCloseModal = () => {
    setIsWalletModalVisible(false);
    setIsResultModalVisible(false);
  };

  const toggleModal = () => {
    setIsWalletModalVisible(!isWalletModalVisible);
    setIsResultModalVisible(!isResultModalVisible);
  };

  const checkNFTOwnership = async (walletAddress: string) => {
    try {
      if (!nftCollection) return false;

      // Fetch the number of NFTs owned by the wallet
      const balance = await nftCollection.balanceOf(walletAddress);
      console.log("NFT balance:", balance.toString());

      return balance.gt(0);
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
      return false;
    }
  };

  const saveWalletAddress = async (walletAddress: string) => {
    try {
      const userDocRef = doc(db, "users", walletAddress);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const referralCode = generateReferralCode();
        await setDoc(userDocRef, {
          walletAddress,
          totalPoints: 0,
          currentRank: 0,
          referrals: 0,
          questsCompleted: 0,
          nftsCollected: 0,
          referralCode,
          twitterConnected: false
        });
      } else {
        const userData = userDoc.data();
        await updateDoc(userDocRef, {
          walletAddress,
          totalPoints: userData?.totalPoints || 0,
          currentRank: userData?.currentRank || 0,
          referrals: userData?.referrals || 0,
          questsCompleted: userData?.questsCompleted || 0,
          nftsCollected: userData?.nftsCollected || 0,
          referralCode: userData?.referralCode || generateReferralCode(),
          twitterConnected: userData?.twitterConnected || false
        });
      }
    } catch (error) {
      console.error("Error saving wallet address:", error);
    }
  };

  return (
    <div className="text-customGold text-3xl mt-5 uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 max-w-60 tracking-wider">
      Begin Your Quest
      <button
        className="btn btn-glass rounded-box mt-20 bg-customGold text-black leading-4 hover:bg-customGold hover:text-white duration-300"
        onClick={handleConnectWallet}
      >
        CONNECT WALLET
      </button>
      {isWalletModalVisible && (
        <Modal
          className="text-customGold text-3xl uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 bg-opacity-60"
          content={
            <div className="flex flex-col items-center">
              <h2 className="text-2xl my-4 text-customGold">Select Wallet</h2>
              <div className="flex gap-10">
                <button
                  className="flex flex-col items-center text-white hover:bg-customGold hover:text-white duration-300 mb-2 rounded-box p-2 transition-transform transform hover:scale-110"
                  onClick={handleWalletClick}
                >
                  <div className="bg-base-300 p-10 rounded-box">
                    <Image
                      src="/metamasklogo.svg"
                      alt="MetaMask"
                      width={80}
                      height={80}
                      priority
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </div>
                  <div className="mt-2 text-xl">MetaMask</div>
                </button>
              </div>
            </div>
          }
          onClose={() => setIsWalletModalVisible(false)}
        />
      )}
      {isResultModalVisible && (
        <Modal
          className="text-customGold text-3xl uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 bg-opacity-60"
          content={
            <div className="flex flex-col items-center">
              {isSuccessful ? (
                <>
                  <h2 className="text-2xl mb-4 text-customGold">Success</h2>
                  <Image
                    src="/checkmark.svg"
                    alt="Success"
                    width={50}
                    height={50}
                    className="m-2"
                  />
                  <p className="text-xl normal-case mt-4">
                    Wallet connected and authenticated successfully!
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl mb-4 text-customGold">Failed</h2>
                  <Image
                    src="/cancel.svg"
                    alt="Failed"
                    width={50}
                    height={50}
                    className="m-2"
                  />
                  <p className="text-xl normal-case mt-4">{errorMessage}</p>
                </>
              )}
            </div>
          }
          onClose={() => setIsResultModalVisible(false)}
        />
      )}
    </div>
  );
};

// Wrap the component with ThirdwebProvider
export default function WrappedConnectWallet() {
  return (
    <ThirdwebProvider activeChain="polygon" clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY}>
      {" "}
      {/* Specify active chain */}
      <ConnectWallet />
    </ThirdwebProvider>
  );
}
