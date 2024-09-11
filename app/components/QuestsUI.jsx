import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";
import { audiowide } from "./fonts";
import Modal from "./Modal";

const completeQuest = async (userId, questId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const questDocRef = doc(db, "quests", questId);

    const userDoc = await getDoc(userDocRef);
    const questDoc = await getDoc(questDocRef);

    if (userDoc.exists() && questDoc.exists()) {
      const userData = userDoc.data();
      const questData = questDoc.data();

      await updateDoc(userDocRef, {
        totalPoints: (userData.totalPoints || 0) + questData.pointsReward,
        questsCompleted: (userData.questsCompleted || 0) + 1,
        nftsCollected: (userData.nftsCollected || 0) + 1
      });

      await setDoc(doc(db, "nfts", `nft_${userId}_${questId}`), {
        name: questData.nftReward.name,
        description: questData.nftReward.description,
        image: questData.nftReward.image,
        owner: userId,
        mintedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error completing quest:", error);
  }
};

const Quests = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const querySnapshot = await getDocs(collection(db, "quests"));
      const questsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuests(questsData);
    };

    fetchQuests();
  }, []);

  const handleEarnPointsClick = (questId) => {
    const userId = "USER_ID"; // Replace with actual user ID
    completeQuest(userId, questId);
    setQuests((prevQuests) =>
      prevQuests.filter((quest) => quest.id !== questId)
    );
  };

  const handleNFTClick = () => {
    console.log("Clicked");
    return <Modal />;
  };

  return (
    <div className="text-white w-full mt-10 mx-auto shadow-lg shadow-black flex flex-col items-center bg-black bg-opacity-35 p-10 border border-customGold rounded-box">
      <div className="flex items-center justify-start w-full mb-4">
        <Image
          src="/puzzle.png"
          alt="icon"
          width={40}
          height={40}
          className=""
        />
        <div className="ml-4">
          <h1 className="font-bold">QUESTS</h1>
          <p className="text-gray-400">
            Complete daily quests! More points & new quests await.
          </p>
        </div>
      </div>
      <div className="bg-black justify-center uppercase p-2 border border-customGold max-w-fit mt-6 mb-6 rounded-md">
        SOCIAL QUEST
      </div>
      <div className="flex flex-col max-h-96 w-full overflow-y-auto border border-t-customGold border-b-customGold border-l-customGold border-r-0 rounded-box p-5 bg-black bg-opacity-50 scrollbar-thin scrollbar-thumb-customGold scrollbar-track-base-300">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="mb-2 flex justify-between items-center w-full"
          >
            <div className="flex w-full">
              <Image
                src="/point.svg"
                alt="point"
                width={35}
                height={26}
                priority
                className=""
              />
              <div className="flex border-b items-center border-customGold border-opacity-30 p-2 w-full">
                <div className="flex flex-col lg:w-full">
                  <span className="text-sm">{quest.description}</span>
                  <span
                    className={`${audiowide.className} text-yellow-500 text-sm font-bold`}
                  >
                    +{quest.pointsReward}
                  </span>
                </div>
                <div className="rounded-full border-2 border-customGold ml-3 h-fit shadow-md shadow-black">
                  <Image
                    src="/xtnctn01.jpg"
                    alt="Profile Icon"
                    width={30}
                    height={30}
                    priority
                    className="rounded-full"
                    onClick={handleNFTClick}
                  />
                </div>
                <button
                  className="bg-black text-white text-xs w-32 lg:text-sm lg:w-36 border border-customGold py-2 px-4 rounded-3xl ml-3 hover:bg-customGold"
                  onClick={() => handleEarnPointsClick(quest.id)}
                >
                  Get Points
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
