"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import "./styles.css";
import styles from "../components/styles/Background.module.css";

const items = [{ label: "About" }, { label: "Contact" }, { label: "FAQ" }];

export default function Home() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <header>
        <Navbar>
          <div className="flex-none flex items-center relative">
            <button
              className="btn btn-square btn-ghost p-0"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-10 w-10 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="#D4BA64"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            {isMenuVisible && (
              <div className="absolute top-full right-0 mt-2 z-20">
                <Menu items={items} className="shadow-lg" />
              </div>
            )}
          </div>
          {isMenuVisible && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0"
              onClick={toggleMenu} // Optional: Close the menu when clicking outside
            />
          )}
        </Navbar>
      </header>
      <main className="flex flex-col items-center">
        <div className="flex justify-center">
          <Image
            src="/gameplan.svg"
            alt="GAMEPLAN"
            width={800}
            height={24}
            priority
          />
        </div>
        <div className="flex items-center flex-col gap-10 md:flex-row md:gap-5 mt-10">
          <div className="flex flex-col items-center gap-4 sm:w-full sm:align-center">
            <div>
              <Image
                src="/roadtoxtnctn.svg"
                alt="Road To XTNCTN"
                width={800}
                height={24}
                priority
              />
            </div>
            <div>
              <Image
                src="/thefinalphase.svg"
                alt="The Final Phase"
                width={500}
                height={24}
                priority
              />
            </div>
          </div>
          <div className="flex">
            <ConnectWallet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
