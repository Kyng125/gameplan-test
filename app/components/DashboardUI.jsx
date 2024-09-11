import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../components/styles/Background.module.css";
import { audiowide } from "./fonts";

const Dashboard = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [nftsCollected, setNftsCollected] = useState(0);

  useEffect(() => {
    // Replace with actual data fetching logic
    setTotalPoints(1234); // Example value
    setCurrentRank(5); // Example value
    setReferrals(10); // Example value
    setNftsCollected(3); // Example value
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      <div className="flex flex-col items-center bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold p-5 lg:p-10 gap-2 lg:gap-5 rounded-box w-full sm:w-auto sm:flex-1">
        <span className="text-white uppercase font-bold">Points</span>
        <span
          className={`${audiowide.className} text-green-500 text-2xl flex items-center gap-1 md:text-lg sm:text-md`}
        >
          {totalPoints}
          <span className="text-white text-xs lg:text-sm"> pts</span>
        </span>
      </div>
      <div className="flex flex-col items-center bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold p-5 lg:p-10 gap-2 lg:gap-5 rounded-box w-full sm:w-auto sm:flex-1">
        <span className="text-white uppercase font-bold">Rank</span>
        <span
          className={`${audiowide.className} text-green-500 text-2xl flex items-center gap-1 md:text-lg sm:text-md`}
        >
          <span className="text-white text-xs lg:text-sm"># </span>
          {currentRank}
        </span>
      </div>
      <div className="flex flex-col items-center bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold p-5 lg:p-10 gap-2 lg:gap-5 rounded-box w-full sm:w-auto sm:flex-1">
        <span className="text-white uppercase font-bold">Referrals</span>
        <span
          className={`${audiowide.className} text-green-500 text-2xl flex items-center gap-1 md:text-lg sm:text-md`}
        >
          {referrals}
          <span className="text-white text-xs lg:text-sm"> refs</span>
        </span>
      </div>
      <div className="flex flex-col items-center bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold p-5 lg:p-10 gap-2 lg:gap-5 rounded-box w-full sm:w-auto sm:flex-1">
        <span className="text-white uppercase font-bold">NFTs</span>
        <span
          className={`${audiowide.className} text-green-500 text-2xl md:text-lg sm:text-md`}
        >
          {nftsCollected}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
