"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "./Modal";
import { signIn } from "next-auth/react";
// import "@solana/wallet-adapter-react-ui/styles.css";
import { audiowide } from "./fonts";
import styles from "../components/styles/Background.module.css";

interface ConnectXCardProps {
  metrics: string;
  width?: string;
}

const ConnectXCard: React.FC<ConnectXCardProps> = ({ metrics, width }) => {
  const [user] = useAuthState(auth);
  const [isTwitterModalVisible, setIsTwitterModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleConnectXClick = () => {
    console.log("Connect X button has been clicked");
    setIsTwitterModalVisible(true);
  };

  const handleSuccess = async (response: any) => {
    setIsTwitterModalVisible(false);
    try {
      console.log("Twitter connected successfully:", response);

      const userDocRef = doc(db, "users", user?.uid || "default"); // Ensure user?.uid is not undefined
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          walletAddress: user?.uid,
          totalPoints: 0,
          currentRank: 0,
          referrals: 0,
          questsCompleted: 0,
          nftsCollected: 0,
          twitterConnected: true,
        });
      } else {
        const userData = userDoc.data();
        if (!userData?.twitterConnected) {
          await updateDoc(userDocRef, {
            twitterConnected: true,
          });
        }
      }

      setIsSuccessful(true);
    } catch (error) {
      setIsSuccessful(false);
      setErrorMessage((error as Error).message);
    }

    setIsResultModalVisible(true);
  };

  const handleFailure = (error: any) => {
    setIsSuccessful(false);
    setErrorMessage(error.message || "Twitter connection failed");
    setIsResultModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsTwitterModalVisible(false);
    setIsResultModalVisible(false);
  };

  const toggleModal = () => {
    setIsTwitterModalVisible(!isTwitterModalVisible);
    setIsResultModalVisible(!isResultModalVisible);
  };

  return (
    <div
      className={`${styles.card} ${width} relative text-customGold text-3xl mt-10 ml-5 max-w-72 shadow-lg shadow-black uppercase border border-customGold rounded-3xl p-6 flex flex-col items-center bg-base-300 w-64`}
    >
      <div className="flex flex-start items-center gap-2 mt-7 mb-36">
        <Image
          src="/global.svg"
          alt="global"
          width={40}
          height={26}
          priority
          className=""
        />
        <div className="flex flex-col">
          <h1 className="text-white text-sm uppercase font-bold">Connect X</h1>
          <div className="normal-case text-white text-xs">
            Connect your X / Twitter account to complete quests and earn points
          </div>
        </div>
      </div>
      <button
        className="btn btn-glass mt-2 rounded-box bg-base-300 shadow-md shadow-black text-2xl text-customGold hover:bg-customGold hover:text-white duration-300"
        onClick={handleConnectXClick}
      >
        Connect
        <span>
          <Image
            src="/xwhite.svg"
            alt="global"
            width={26}
            height={26}
            priority
            className=""
          />
        </span>
      </button>
      {isTwitterModalVisible && (
        <Modal
          className="text-customGold text-3xl uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 bg-opacity-60"
          content={
            <div className="flex flex-col items-center">
              <h2 className="text-2xl my-4 text-customGold">
                Connect with Twitter
              </h2>
              <button
                onClick={() =>
                  signIn("twitter", { callbackUrl: "YOUR_CALLBACK_URL" })
                }
                className="btn btn-glass rounded-box bg-customGold text-black leading-4 hover:bg-customGold hover:text-white duration-300"
              >
                Connect Twitter
              </button>
            </div>
          }
          onClose={handleCloseModal}
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
                    Twitter account connected successfully!
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
          onClose={handleCloseModal}
        />
      )}
      {isResultModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0"
          onClick={toggleModal}
        />
      )}
    </div>
  );
};

export default ConnectXCard;
