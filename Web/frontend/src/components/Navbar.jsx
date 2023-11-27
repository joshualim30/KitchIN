import { useState } from "react";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Product",
  },
  {
    id: "clients",
    title: "Clients",
  },
];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="bg-primary w-full flex py-4 px-4 justify-between items-center navbar">
      {/* Logo */}
      <div className="flex inline-block items-center">
                <img className="w-8 cursor-pointer shadow-2xl" src={require('../images/logo.png')} alt="..."/>
                <h1 className="font-CreteRoundRegular text-white text-xl ml-2">KitchIN</h1>
        </div>
      
      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden justify-center items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-CreteRoundRegular px-2 cursor-pointer text-[16px] hover:text-gray-200 ${
              active === nav.title ? "text-white" : "text-white"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}
            ${active===nav.title ? "underline underline-offset-4 decoration-4" : ""}
            `}
            onClick={() => setActive(nav.title)}
          >
            <a href={`${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

    <div className="flex mobile:ml-40 md:ml-0">
    <a href="/auth"><button id="sign-in" className="bg-white text-green-600 font-CreteRoundRegular px-5 py-2 rounded-full hover:bg-green-800">Portal</button></a>

    </div>


      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? require("../images/close.jpeg") : require("../images/menu.jpeg")}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        {/* Sidebar */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-[#141414] bg-dark absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-green-500" : "text-green-500"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}
                ${active===nav.title ? "underline underline-offset-4 decoration-4" : ""}

                `}
                onClick={() => setActive(nav.title)}
              >
                <a href={`${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;