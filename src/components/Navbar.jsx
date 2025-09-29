import React, { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { GoBellFill } from "react-icons/go";
import assets from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { useEffect } from "react";

const Navbar = () => {
  const cart = JSON.parse(localStorage.getItem("carts")) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [cartItem, setCartItem] = useState(0);
  useEffect(() => {
    setCartItem(cart.length);
    console.log(cartItem);
  }, [cart]);

  const navItems = [
    {
      name: "Dashboard",
      // icon: <MdOutlineDashboard size={20} />,
      path: "/user/overview",
      role: ["user"],
    },
    {
      name: "Dashboard",
      // icon: <MdOutlineDashboard size={20} />,
      path: "/admin/overview",
      role: ["admin"],
    },
    {
      name: "Users",
      // icon: <MdOutlineDashboard size={20} />,
      path: "/admin/users",
      role: ["admin"],
    },
    {
      name: "Network",
      // icon: <PiNetwork size={20} />,
      path: "/user/network",
      role: ["user"],
    },
    {
      name: "Profile",
      // icon: <PiNetwork size={20} />,
      path: "/user/profile",
      role: ["user"],
    },
    {
      name: "Transfer Funds",
      // icon: <PiNetwork size={20} />,
      path: "/user/deposit",
      role: ["user"],
    },
    {
      name: "Register",
      // icon: <PiNetwork size={20} />,
      path: "/user/register",
      role: ["user"],
    },
    {
      name: "Products",
      // icon: <PiNetwork size={20} />,
      path: "/user/products",
      role: ["user"],
    },
    {
      name: "Testimonials",
      // icon: <PiNetwork size={20} />,
      path: "/admin/testimonials",
      role: ["admin"],
    },
    {
      name: "Product Upload",
      // icon: <PiNetwork size={20} />,
      path: "/admin/product-upload",
      role: ["admin"],
    },
    {
      name: "AllTransactions",
      // icon: <PiNetwork size={20} />,
      path: "/admin/transactions",
      role: ["admin"],
    },
    {
      name: "Package Upload",
      // icon: <PiNetwork size={20} />,
      path: "/admin/package-upload",
      role: ["admin"],
    },
  ];

  // const filteredLinks = navItems.filter(navItem => (Array.isArray(navItem.role) && navItem.role.includes(user?.role)));

  return (
    <div>
      <nav className="w-full bg-white flex items-center justify-between gap-6 lg:px-8 px-4 md:py-2 py-4 shadow-md">
        <div className="flex w-[calc(100%-152px-24px)] items-center md:gap-6 gap-3">
          <button
            type="button"
            className="md:hidden block text-2xl"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <HiMiniBars3BottomLeft />
          </button>
          <img
            src={assets.logo}
            alt="Mudet_Logo"
            className="object-cover md:block hidden"
          />
          <ul className="md:flex hidden items-center gap-6 overflow-x-scroll no-scrollbar">
            {
              // filteredLinks.map(({ name, path }, index) => (
              navItems.map(({ name, path }, index) => (
                <NavLink
                  to={path}
                  key={index}
                  className={({ isActive }) => `
                                        nav-links relative font-semibold whitespace-nowrap text-black cursor-pointer text-base py-1
                                        ${
                                          isActive
                                            ? "active text-primary !font-extrabold"
                                            : ""
                                        }
                                    `}
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </NavLink>
              ))
            }
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary">
            <GoBellFill />
          </button>
          <Link
            to={"/user/cart"}
            className="relative w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary"
          >
            <p className="absolute bottom-[1.4rem] left-[2rem] text-base">
              {cartItem !== 0 ? cartItem : " "}
            </p>
            <IoMdCart />
          </Link>
          <Link
            to={"/user/profile"}
            className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary"
          >
            <h3>OD</h3>
          </Link>
        </div>
      </nav>

      <nav
        className={`absolute top-0 left-0 z-999 w-full h-screen bg-tetiary flex flex-col items-center justify-between gap-6 px-4 py-6 shadow-md ${
          isOpen ? "slide-in" : "slide-out"
        }`}
      >
        <div className="flex flex-col h-[calc(100%-40px-24px)] w-full md:gap-6 gap-3">
          <div className="flex flex-row-reverse items-center justify-between ">
            <button
              type="button"
              className="md:hidden block text-2xl text-secondary"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <IoCloseOutline size={40} />
            </button>
            <img
              src={assets.logo}
              alt="Mudet_Logo"
              className="object-cover w-18 h-18"
            />
          </div>
          <ul className="flex flex-col items-center gap-6 overflow-y-scroll no-scrollbar">
            {
              // filteredLinks.map(({ name, path }, index) => (
              navItems.map(({ name, path }, index) => (
                <NavLink
                  to={path}
                  key={index}
                  className={({ isActive }) => `
                                        nav-links relative font-medium whitespace-nowrap text-black cursor-pointer text-base py-1
                                        ${
                                          isActive
                                            ? "active text-primary !font-extrabold"
                                            : ""
                                        }
                                    `}
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </NavLink>
              ))
            }
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex gap-4 justify-center items-center rounded-full font-medium text-xl bg-tetiary text-primary">
            <IoIosLogOut size={30} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
