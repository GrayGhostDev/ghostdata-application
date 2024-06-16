import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import ConnectWalletButton from "./ConnectWalletButton";
import useAddress from "../hooks/useAddress";
import { Link } from "react-router-dom";
import shortenAddress from "../utils/shortenAddress";
import Logo from "../../src/assets/GGDataMan.svg";

interface NavBarItemProps {
  title: string;
  path: string;
  classprops?: string;
}

const NavBarItem: React.FC<NavBarItemProps> = ({ title, path, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>
    <Link to={path}>{title}</Link>
  </li>
);

const Navbar: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { address } = useAddress();

  const navItems: NavBarItemProps[] = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Transactions", path: "/transactions" },
    { title: "Assets", path: "/assets" },
    { title: "Services", path: "/services" },
    { title: "Market", path: "/market" },
    { title: "Exchange", path: "/exchange" },
    { title: "Wallets", path: "/wallets" },
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
    { title: "Help", path: "/help" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 gradient-bg-navbar">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={Logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navItems.map((item) => (
          <NavBarItem key={item.title} {...item} />
        ))}
        {address ? (
          <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] flex items-center">
            {shortenAddress(address)}
          </li>
        ) : (
          <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
            <ConnectWalletButton />
          </li>
        )}
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed top-0 right-0 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navItems.map((item) => (
              <NavBarItem key={item.title} {...item} classprops="my-2 text-lg" />
            ))}
            {address ? (
              <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] flex items-center">
                {shortenAddress(address)}
              </li>
            ) : (
              <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                <ConnectWalletButton />
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
