"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../components/styles/Background.module.css";
import { audiowide } from "../components/fonts";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { useRouter } from "next/navigation";
import Quests from "../components/QuestsUI";
import Leaderboard from "../components/LeaderboardUI";
import ConnectTwitterModal from "../components/ConnectTwitterModal";
import Modal from "../components/Modal";
import ConnectXCard from "../components/ConnectXCard";

interface UserData {
  walletAddress: string;
  totalPoints: number;
  currentRank: number;
  referrals: number;
  questsCompleted: number;
  twitterConnected: boolean;
}

const Page = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isTwitterModalVisible, setIsTwitterModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSignInDisabled, setIsSignInDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const leaderboardRef = useRef<HTMLDivElement>(null); // Create ref
  const questsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/users");
      const data: UserData = await response.json();
      setUserData(data);
    };

    fetchUserData();

    // Check if the sign-in button should be disabled
    const lastSignInDate = localStorage.getItem("lastSignInDate");
    if (lastSignInDate) {
      const now = new Date();
      const lastSignIn = new Date(lastSignInDate);
      if (
        now.getDate() === lastSignIn.getDate() &&
        now.getMonth() === lastSignIn.getMonth() &&
        now.getFullYear() === lastSignIn.getFullYear()
      ) {
        setIsSignInDisabled(true);
      }
    }
  }, []);

  const handleSignInClick = () => {
    console.log("Sign In button has been clicked");
    if (userData) {
      setUserData((prevData) => ({
        ...prevData!,
        totalPoints: prevData!.totalPoints + 100,
      }));
    }
    setIsSignInModalVisible(true);
    setIsSignInDisabled(true);
    localStorage.setItem("lastSignInDate", new Date().toISOString());
  };

  const handleProfileClick = () => {
    router.push("/quests/profile");
    console.log("Profile icon clicked");
  };

  const handleAddressClick = () => {
    router.push("/quests/profile");
    console.log("Address clicked");
  };

  const handleLogoutClick = () => {
    router.push("/");
    console.log("Logout icon clicked");
  };

  const handleConnectWallet = () => {
    console.log("Connect Wallet button clicked");
  };

  const handleBoostClick = () => {
    console.log("Boost button has been clicked");
  };

  const handleFaqClick = () => {
    console.log("FAQ button has been clicked");
  };

  const handleEarnPointsClick = () => {
    console.log("Earn Points button has been clicked");
    questsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLeaderboardClick = () => {
    console.log("Leaderboard button has been clicked");
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConnectXClick = () => {
    setIsTwitterModalVisible(true);
    console.log("Connect X button has been clicked");
  };

  const handleSuccess = () => {
    setIsTwitterModalVisible(false);
    setIsSuccessful(true);
    setIsResultModalVisible(true);
  };

  const handleFailure = (message: string) => {
    setIsTwitterModalVisible(false);
    setErrorMessage(message);
    setIsSuccessful(false);
    setIsResultModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsSignInModalVisible(false);
    setIsTwitterModalVisible(false);
    setIsResultModalVisible(false);
  };

  return (
    <div className={`${styles.questpgbg} ${styles.bc} text-white`}>
      <Navbar className="absolute left-4 items-center">
        <div className="flex gap-3 p-3 rounded-box cursor-pointer duration-100 hover:bg-neutral hover:bg-opacity-30 active:bg-opacity-100">
          <div className="avatar">
            <div
              className="rounded-full shadow-md shadow-black"
              onClick={handleProfileClick}
            >
              <Image
                src="/profileicon.svg"
                alt="Profile Icon"
                width={30}
                height={30}
                priority
                className=""
                onClick={handleProfileClick}
              />
            </div>
          </div>
          <div
            className="border-2 border-customGold rounded-box p-2 bg-black bg-opacity-30 text-sm shadow-lg shadow-black cursor-pointer"
            onClick={handleAddressClick}
          >
            <p>{userData?.walletAddress || "0x7564534"}</p>
          </div>
        </div>
        <div className="absolute right-4 flex gap-4 p-3 rounded-box cursor-pointer duration-100 hover:bg-neutral hover:bg-opacity-30 active:bg-opacity-100">
          <Image
            src="/logout.svg"
            alt="Log out"
            width={30}
            height={30}
            priority
            className=""
            onClick={handleLogoutClick}
          />
        </div>
      </Navbar>
      <div className="flex flex-wrap gap-8 justify-center">
        <Card
          icon={
            <Image
              src="/faqicon.svg"
              alt="lightening"
              width={15}
              height={15}
              priority
              className="absolute top-4 right-6"
              onClick={handleFaqClick}
            />
          }
          onClick={handleEarnPointsClick}
          className="btn btn-glass rounded-box bg-base-300 shadow-md shadow-black text-2xl text-customGold hover:bg-customGold hover:text-white duration-300"
          title={
            <div className="flex flex-row items-center gap-2 mt-9 mb-28">
              <h1 className="text-white text-sm uppercase inline-flex font-bold">
                Total points
              </h1>
              <button
                className={`${styles.rectangle} text-black text-lg font-bold inline-flex flex-row items-center rounded-3xl px-3 py-1 gap-2 shadow-dazzle-shadow transition-transform duration-100 transform hover:scale-105`}
                onClick={handleBoostClick}
              >
                <Image
                  src="/lightening.svg"
                  alt="lightening"
                  width={8}
                  height={8}
                  priority
                  className=""
                />
                BOOST
              </button>
            </div>
          }
          metrics={
            <div
              className={`${audiowide.className} text-white mb-7 text-start`}
            >
              {userData?.totalPoints || 0}
              <span
                className={`${audiowide.className} text-sm text-customGold`}
              >
                {" "}
                pts
              </span>
            </div>
          }
          buttonText="Earn Points"
          width="w-72"
        />
        <Card
          onClick={handleLeaderboardClick}
          className="btn btn-glass rounded-box bg-base-300 shadow-md shadow-black text-2xl text-customGold hover:bg-customGold hover:text-white duration-300"
          title={
            <div className="flex flex-row flex-start items-center mt-6 mb-24">
              <Image
                src="/crown.png"
                alt="crown"
                width={60}
                height={26}
                priority
                className=""
              />
              <h1 className="text-white text-sm uppercase inline-flex font-bold">
                Ranking
              </h1>
            </div>
          }
          metrics={
            <div
              className={`${audiowide.className} text-white mb-7 text-start`}
            >
              <span className="text-customGold"># </span>
              {userData?.currentRank || 0}
            </div>
          }
          buttonText="Leaderboard"
          width="w-64"
        />
        <ConnectXCard metrics={"7"} />
        <Card
          onClick={handleSignInClick}
          className="btn btn-glass rounded-box bg-customGold shadow-md shadow-black text-2xl text-black"
          title={
            <div className="flex flex-col items-center gap-10 mt-9 mb-9">
              <h1 className="text-white text-sm uppercase inline-flex">
                Daily Sign-In
              </h1>
              <Image
                src="/signinicon.svg"
                alt="Sign In"
                width={48}
                height={26}
                priority
                className=""
              />
            </div>
          }
          metrics={
            <div
              className={`${audiowide.className} text-white mb-7 text-center`}
            >
              {userData?.totalPoints || 0}
            </div>
          }
          buttonText="Claim"
          width="w-64"
          disabled={isSignInDisabled}
        />
      </div>

      <div className="mt-9 flex flex-col lg:flex-row">
        <div className="flex-1" ref={questsRef}>
          <Quests />
        </div>
        <div className="flex lg:flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <Card
              title={
                <div className="flex flex-row items-center mt-2 mb-8">
                  <Image
                    src="/threeguys.png"
                    alt="crown"
                    width={70}
                    height={26}
                    priority
                    className=""
                  />
                  <div className="flex flex-col">
                    <h1 className="text-white text-sm uppercase inline-flex font-bold">
                      Refferals
                    </h1>
                    <p className={`${styles.text} normal-case text-white`}>
                      Refer a friend, get rewarded with 1000 points with each
                      referral while your referrals are rewarded with 500 points
                      each!
                    </p>
                  </div>
                </div>
              }
              metrics={
                <div
                  className={`${audiowide.className} text-white text-start mb-4`}
                >
                  {userData?.referrals || 0}{" "}
                  <span className="text-sm text-customGold">refs</span>
                </div>
              }
              referralCode={referralCode}
              width="w-96"
            />
            <Card
              title={
                <div className="flex flex-col items-center mt-2 mb-24">
                  <h1 className="text-white text-sm uppercase mb-1 inline-flex font-bold">
                    Quests Completed
                  </h1>
                  <p className={`${styles.text} normal-case text-white`}>
                    Try to complete as many quests as you can to collect as many
                    points and to stack up up as many NFTs as possible. The more
                    you have, the better it gets.
                  </p>
                </div>
              }
              metrics={
                <div
                  className={`${audiowide.className} text-white mb-5 text-center`}
                >
                  {userData?.questsCompleted || 0}
                </div>
              }
              width="w-96"
            />
          </div>
        </div>
      </div>

      <div className="flex  gap-7 mt-7 flex-wrap">
        <div className="relative p-1 shadow-lg shadow-black w-full sm:w-auto">
          <div className="flex relative items-center justify-center">
            <Image
              src="/xtnctn01.jpg"
              alt="XTNCTN"
              width={300}
              height={100}
              priority
              className="border border-customGold rounded-box"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center border border-customGold rounded-box backdrop-blur-sm">
            <Image
              src="/comingsoon.svg" // Replace with your overlay image source
              alt="Overlay"
              width={200}
              height={100}
              priority
              className="rounded-box"
            />
          </div>
        </div>
        <div className="relative text-white w-full mx-auto shadow-lg shadow-black flex flex-1 flex-col items-center bg-black bg-opacity-35 p-2 border border-customGold rounded-box">
          <div className="relative mx-auto w-full bg-black bg-opacity-45 p-32 border border-customGold rounded-box">
            <div className="absolute inset-0 flex items-center justify-center border border-customGold rounded-box backdrop-blur-sm">
              <Image
                src="/comingsoon.svg" // Replace with your overlay image source
                alt="Overlay"
                width={200}
                height={100}
                priority
                className="rounded-box"
              />
            </div>
          </div>
          <div className="flex gap-2 absolute bottom-3">
            <button className="border border-customGold py-1 px-2 bg-black rounded-box"></button>
            <button className="border border-customGold py-1 px-2 bg-black rounded-box"></button>
            <button className="border border-customGold py-1 px-2 bg-black rounded-box"></button>
          </div>
        </div>
      </div>
      <div ref={leaderboardRef}>
        <Leaderboard />
      </div>
      <Footer
        icon={
          <div className="">
            <Image
              src="/3dadzlogoandname.svg"
              alt="3dadz Brand Logo"
              width={48}
              height={26}
              priority
              className=""
            />
          </div>
        }
      />
      {isTwitterModalVisible && (
        <ConnectTwitterModal
          isVisible={isTwitterModalVisible}
          onClose={() => setIsTwitterModalVisible(false)}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      )}
      {isResultModalVisible && (
        <Modal
          isVisible={isResultModalVisible}
          onClose={handleCloseModal}
          className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold"
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
                    Twitter/X account connected successfully!
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
        />
      )}
      {isSignInModalVisible && (
        <Modal
          isVisible={isSignInModalVisible}
          onClose={handleCloseModal}
          className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold"
          content={
            <div className="flex flex-col items-center">
              <h2 className={`${audiowide.className} text-2xl mb-4`}>
                Congratulations
              </h2>
              <Image
                src="/checkmark.svg"
                alt="Success"
                width={50}
                height={50}
                className="m-2"
              />
              <p className="text-xl normal-case mt-4">
                Your points have been claimed
              </p>
              <p
                className={`${audiowide.className} text-2xl mb-4 text-customGold`}
              >
                100
              </p>
              <button
                className="bg-customGold text-black text-sm border border-customGold py-2 px-4 rounded-3xl mt-4 hover:bg-black hover:text-white"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Page;
