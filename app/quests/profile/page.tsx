"use client";

import React, { useState } from "react";
import styles from "../../components/styles/Background.module.css";
import Navbar from "@/app/components/Navbar";
import Dashboard from "@/app/components/DashboardUI";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("DOGZ");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setText(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/quests/profile");
    console.log("Profile icon clicked");
  };

  const handleClose = () => {
    router.push("/quests");
    console.log("Closed");
  };

  return (
    <div className={`${styles.questpgbg} text-white`}>
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
            onClick={handleProfileClick}
          >
            <p>0x7564534</p>
          </div>
        </div>
        <div className="absolute right-4 flex gap-4 p-3 rounded-box cursor-pointer duration-100 hover:bg-neutral hover:bg-opacity-30 active:bg-opacity-100">
          <Image
            src="/close.svg"
            alt="Close"
            width={30}
            height={30}
            priority
            className=""
            onClick={handleClose}
          />
        </div>
      </Navbar>
      <div className="flex flex-col lg:flex-row gap-10 mt-5 items-center w-full justify-center">
        <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
          <Image
            src="/profileicon.svg"
            alt="Profile Icon"
            width={100}
            height={100}
            priority
            className=""
            onClick={handleClose}
          />
          <div className="flex flex-col align-middle gap-2 text-center lg:text-left">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={text}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="bg-black bg-opacity-75 text-white py-1 px-3 rounded-box border border-customGold"
                  autoFocus
                />
              ) : (
                <>
                  <p className="uppercase font-extrabold">{text}</p>
                  <Image
                    src="/edit.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                    priority
                    className="cursor-pointer"
                    onClick={handleEditClick}
                  />
                </>
              )}
            </div>
            <div className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold py-1 px-3 rounded-box">
              <p>0x7564534</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full lg:w-auto">
          <Image
            src="/marblepattern.svg"
            alt="Marble Pattern"
            width={600}
            height={400}
            priority
            className=""
          />
        </div>
      </div>
      <div className="flex flex-col bg-black bg-opacity-55 z-30 backdrop-blur-sm border border-customGold rounded-box p-4 mt-5">
        <div className="flex justify-between">
          <Image
            src="/overview.svg"
            alt="Overview"
            width={70}
            height={50}
            priority
            className=""
            onClick={handleClose}
          />
          <button className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold py-1 px-3 text-customGold text-sm rounded-box">
            View collection
          </button>
        </div>
        <div>
          <Dashboard />
        </div>
      </div>
      <div
        style={{
          background: "linear-gradient(to right, #231608, #987643)",
        }}
        className="relative mx-auto mt-10 w-full bg-black bg-opacity-45 p-32 border border-customGold rounded-box"
      >
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
      <div className="flex items-center justify-center mt-10">
        <Image
          src="/3dadzminidazzle.svg"
          alt="3Dadz Logo"
          width={70}
          height={50}
          priority
          className=""
        />
        <Image
          src="/xletterdazzle.svg"
          alt="X"
          width={30}
          height={30}
          priority
          className=""
        />
        <Image
          src="/blastlogo.svg"
          alt="Built on Blast"
          width={70}
          height={70}
          priority
          className=""
        />
      </div>
    </div>
  );
};

export default Page;
