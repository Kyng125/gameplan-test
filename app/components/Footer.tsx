import Link from "next/link";
import Image from "next/image";
import React from "react";

interface Props {
  icon?: React.ReactNode;
}

const Footer = ({ icon }: Props) => {
  return (
    <footer className="flex flex-col gap-32 justify-center items-center mt-36 align-middle md:gap-10">
      <div className="flex justify-evenly items-center gap-10">
        <Link href="#">
          <Image
            src="/email.svg"
            alt="Email"
            width={30}
            height={30}
            priority
            className="transition-transform duration-300 transform hover:scale-125"
          />
        </Link>
        <Link href="#">
          <Image
            src="/discord.svg"
            alt="Discord"
            width={30}
            height={30}
            priority
            className="transition-transform duration-300 transform hover:scale-125"
          />
        </Link>
        <Link href="#">
          <Image
            src="/twitter.svg"
            alt="Twitter / X"
            width={30}
            height={30}
            priority
            className="transition-transform duration-300 transform hover:scale-125"
          />
        </Link>
      </div>
      <div className="flex gap-5">
        <div>{icon}</div>
        <div className="">
          <Link href="hhtps://blast.io">
            <Image
              src="/blastlogo.svg"
              alt="Built on Blast"
              width={150}
              height={100}
              priority
              className="transition-transform duration-300 transform hover:scale-125"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
