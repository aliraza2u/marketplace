import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import { NAVBAR } from "../../constants";
import Button from "../Button";
import logo from "../../public/images/logo.png";
import twitter from "../../public/images/twitter-logo.svg";
import wallet from "../../public/images/wallet.svg";
import hamburger from "../../public/images/hamburger.svg";
import SlideDownMenu from "../SlideDownMenu";

const Navbar: FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const [color, setColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => window.removeEventListener("scroll", changeColor);
  }, []);

  const changeColor = () => {
    if (window.scrollY >= 60) setColor(true);
    else setColor(false);
  };

  return (
    <div
      className={`px-4 flex justify-between items-center lg:px-[78px] w-full fixed z-10 py-4 ${
        color ? "bg-night py-2" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2">
        <Image
          src={logo}
          alt="NITFEE"
          className="w-[46px] h-[48px] lg:w-[72px] lg:h-[70px] object-contain"
        />
        <h1 className="text-2xl text-white lg:text-[32px] font-bold uppercase">NITFEE</h1>
      </div>
      <div className="hidden lg:flex gap-9">
        {NAVBAR?.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className="text-base font-bold text-white uppercase"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex gap-5">
        <a href="https://twitter.com/nitfeemarketCFX" target={"_blank"}>
          <Button
            className="uppercase text-base text-white flex gap-2 items-center"
            type="transparent"
          >
            <Image
              src={twitter}
              alt="marketplan nitfee discord"
              className="w-6 h-6 object-contain"
            />
            Twitter
          </Button>
        </a>
        {address && (
          <p className="font-medium text-white px-6 py-3 rounded-xl border border-[#141B22] min-w-[154px]">
            {address?.slice(0, 6).concat("...").concat(address?.slice(-4))}
          </p>
        )}
        <Button
          className="uppercase font-bold text-base text-white flex gap-2 items-center px-6 py-3 rounded-xl walletConnectButton"
          onClick={() => {
            address ? disconnect() : connectWithMetamask();
          }}
        >
          <Image src={wallet} alt="marketplan nitfee discord" className="w-6 h-4 object-contain" />
          {address ? "Disconnect" : "Connect"}
        </Button>
      </div>
      {/* // Mobie screeen */}
      <div className="lg:hidden">
        <Image
          src={hamburger}
          alt=""
          className="object-contain"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && <SlideDownMenu menu={NAVBAR} callback={setIsOpen} />}
    </div>
  );
};

export default Navbar;
