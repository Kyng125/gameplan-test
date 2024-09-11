import React, { useState } from "react";
import Modal from "./Modal";
import { mate_sc } from "./fonts";

interface MenuItem {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
}

interface MenuProps {
  items: MenuItem[];
  className?: string;
}

const Menu: React.FC<MenuProps> = ({ items, className }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className={"relative mt-2"}>
      <ul
        className={`menu bg-base-200 rounded-box w-56 p-4 ${className} max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-customGold scrollbar-track-base-300`}
      >
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              target={item.target}
              rel={item.rel}
              onClick={() => handleItemClick(item)}
              className={`${mate_sc.className} border border-customGold rounded-box mb-3 mt-1 text-white uppercase flex flex-row justify-center`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {selectedItem && (
        <Modal
          content={<ContentForItem item={selectedItem} />}
          onClose={handleCloseModal}
          className="bg-black bg-opacity-75 z-30 backdrop-blur-sm border border-customGold"
        />
      )}
    </div>
  );
};

const ContentForItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  switch (item.label) {
    case "About":
      return (
        <div
          className={`${mate_sc.className} text-center mt-5 scrollbar-thin scrollbar-thumb-customGold scrollbar-track-base-300 max-h-96 overflow-y-auto`}
        >
          About content goes here
        </div>
      );
    case "Contact":
      return (
        <div
          className={`${mate_sc.className} text-center mt-5 scrollbar-thin scrollbar-thumb-customGold scrollbar-track-base-300 max-h-96 overflow-y-auto`}
        >
          Contact content goes here
        </div>
      );
    case "FAQ":
      return (
        <div
          className={`${mate_sc.className} text-center mt-5 scrollbar-thin scrollbar-thumb-customGold scrollbar-track-base-300 max-h-96 overflow-y-auto`}
        >
          <h4 className="text-customGold">HOW DO I SIGN IN?</h4>
          <p>
            Simply click on the connect wallet button and select an account with
            a DOGGz II (Ch. 2) NFT to connect to the site for authentication.
          </p>
          <h4 className="text-customGold">WHAT DO I DO ON THE SITE?</h4>
          <p>
            You complete quests, earn points and stack up referrals after you’ve
            passed authentication. Make sure to accumulate as much points from
            quest completion as possible. Also try as much as you can to refer
            the quests to your friends, family and acquaintances to complete as
            well.
          </p>
          <h4 className="text-customGold">HOW DO I COMPLETE QUESTS?</h4>
          <p>
            All you have to do is simply head to the quests section on the next
            page and then locate the quest you want to complete. Once located,
            simply click on the quest for more information and click/tap on the
            ‘Get Started’ button to begin (You’ll be taken out of the site to
            perform the quest). Follow the instructions as detailed on the quest
            tab to perform the quests. Once you’re done, simply come back to the
            site with the quest tab open and select complete.
          </p>
          <h4 className="text-customGold">HOW DO I EARN POINTS?</h4>
          <p>
            You earn points by completing quests and referring people to the
            site. Make sure to complete as many quests as possible and refer as
            many people as possible to earn as much points as you can.
          </p>
          <h4 className="text-customGold">HOW DO I MAKE REFERRALS?</h4>
          <p>
            Simply head to your profile by clicking on the little image on the
            top right-hand side of the site and tap/click the ‘Copy’ icon right
            beside your referral link that’ll be displayed on your profile to
            copy the referral link and share with as many people as you want.
          </p>
        </div>
      );
    default:
      return <div>Select an option from the menu please</div>;
  }
};

export default Menu;
