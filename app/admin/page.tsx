'use client'

import React, { useState, useEffect } from 'react';
import "../styles.css";
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Define the Quest interface
interface Quest {
  id: string;
  title: string;
  description: string;
  twitterPostId: string;
  pointsReward: number;
  nftReward: {
    name: string;
    description: string;
    image: string;
  };
  isActive: boolean;
}

const AddQuest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [twitterPostId, setTwitterPostId] = useState('');
  const [pointsReward, setPointsReward] = useState(0);
  const [nftRewardName, setNftRewardName] = useState('');
  const [nftRewardDescription, setNftRewardDescription] = useState('');
  const [nftRewardImage, setNftRewardImage] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    const querySnapshot = await getDocs(collection(db, 'quests'));
    const questsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Quest));
    setQuests(questsData);
  };

  const handleAddQuest = async () => {
    try {
      await addDoc(collection(db, 'quests'), {
        title,
        description,
        twitterPostId,
        pointsReward,
        nftReward: {
          name: nftRewardName,
          description: nftRewardDescription,
          image: nftRewardImage
        },
        isActive: true
      });
      console.log('Quest added successfully!');
      fetchQuests(); // Refresh the quests list
    } catch (error) {
      console.error('Error adding quest:', error);
    }
  };

  const handleUpdateQuest = async (id: string) => {
    try {
      await updateDoc(doc(db, 'quests', id), {
        title,
        description,
        twitterPostId,
        pointsReward,
        nftReward: {
          name: nftRewardName,
          description: nftRewardDescription,
          image: nftRewardImage
        },
        isActive: true
      });
      console.log('Quest updated successfully!');
      fetchQuests(); // Refresh the quests list
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const handleDeleteQuest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'quests', id));
      console.log('Quest deleted successfully!');
      fetchQuests(); // Refresh the quests list
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  };

  return (
    <div className="">
      <h1 className='font-extrabold text-xl text-customGold'>Manage Quests</h1>
      <div className='flex flex-col my-2'>
        <h2 className='text-lg font-bold mb-2 text-white'>Add Quest</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className='p-2 text-customGold' />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className='p-2 text-customGold' />
        <input type="text" placeholder="Twitter Post ID" value={twitterPostId} onChange={(e) => setTwitterPostId(e.target.value)} className='p-2 text-customGold' />
        <input type="number" placeholder="Points Reward" value={pointsReward} onChange={(e) => setPointsReward(Number(e.target.value))} className='text-customGold p-2' />
        <input type="text" placeholder="NFT Reward Name" value={nftRewardName} onChange={(e) => setNftRewardName(e.target.value)} className='p-2 text-customGold' />
        <input type="text" placeholder="NFT Reward Description" value={nftRewardDescription} onChange={(e) => setNftRewardDescription(e.target.value)} className='p-2 text-customGold' />
        <input type="text" placeholder="NFT Reward Image URL" value={nftRewardImage} onChange={(e) => setNftRewardImage(e.target.value)} className='p-2 text-customGold' />
        <button onClick={handleAddQuest} className='w-auto bg-black font-bold text-customGold p-2 my-2 rounded-box'>Add Quest</button>
      </div>
      <div>
        <h2 className='text-lg font-bold mb-2 text-white'>Existing Quests</h2>
        <ul>
          {quests.map((quest) => (
            <li key={quest.id} className='p-2 my-2 bg-base-300 text-white rounded-box'>
              <h3 className='p-2 mb-1'>{quest.title}</h3>
              <p className='p-2 mb-1'>{quest.description}</p>
              <p className='p-2 mb-1'>Twitter Post ID: {quest.twitterPostId}</p>
              <p className='p-2 mb-1'>Points Reward: {quest.pointsReward}</p>
              <p className='p-2 mb-1'>NFT Reward: {quest.nftReward.name} - {quest.nftReward.description}</p>
              <p className='p-2 mb-1'>Image: <img src={quest.nftReward.image} alt={quest.nftReward.name} /></p>
              <button onClick={() => handleUpdateQuest(quest.id)} className='w-auto bg-black font-bold text-customGold p-2 m-1 rounded-box shadow-md shadow-black' >Update</button>
              <button onClick={() => handleDeleteQuest(quest.id)} className='w-auto bg-black font-bold text-customGold p-2 m-1 rounded-box shadow-md shadow-black' >Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddQuest;
