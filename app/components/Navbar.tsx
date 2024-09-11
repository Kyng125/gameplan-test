import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const Navbar = ({ className, children }: Props) => {

  return (
    <div className="relative">
      <div className="navbar bg-base-300 rounded-box px-4 z-10 justify-center max-h-20 shadow-md shadow-black">
        <div className={`flex flex-1 ml-1 ${className}`}>
          <button className="btn btn-square btn-ghost text-customGold p-0 pointer-events-none">
            <Image
              src="/3dadzlogo.svg"
              alt="3Dadz Logo"
              width={100}
              height={24}
              priority
            />
          </button>
        </div>
        {children}
      </div>  
    </div>
  );
};

export default Navbar;
