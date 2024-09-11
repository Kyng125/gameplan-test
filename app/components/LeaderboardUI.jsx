import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { audiowide } from './fonts';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/leaderboard');
        const sortedLeaderboard = response.data.sort((a, b) => b.points - a.points); // Sort by points in descending order
        setLeaderboard(sortedLeaderboard);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard. Please try again later.');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="text-white w-full mt-7 mx-auto p-4 shadow-lg shadow-black flex flex-col items-center bg-black bg-opacity-35 border border-customGold rounded-box">
      <div>
        <Image
          src="/trophy.png"
          alt="trophy"
          width={48}
          height={26}
          priority
          className="rounded-box"
        />
      </div>
      <div className={`${audiowide.className} uppercase text-2xl`}>Leaderboard</div>
      <div className="w-full mt-4 flex justify-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <ul className="w-full">
            {leaderboard.map((user, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b border-customGold">
                <span className="text-sm">{index + 1}</span> {/* Index of the user */}
                <span className="text-sm">{user.name}</span>
                <span className="text-sm">{user.wallet}</span>
                <span className="text-sm">{user.points}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
