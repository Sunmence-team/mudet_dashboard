import React, { useRef, useState } from "react";
import { IoMdCart } from "react-icons/io";
import { GoBellFill } from "react-icons/go";
import assets from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useCart } from "../context/CartProvider";

const Navbar = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartItem = cart.length;

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // detect if we can scroll in either direction
  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollPosition(); // initial check
    el.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      el.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      path: "/user/overview",
      role: ["user"],
    },
    {
      name: "Dashboard",
      path: "/admin/overview",
      role: ["admin"],
    },
    {
      name: "Users",
      path: "/admin/users",
      role: ["admin"],
    },
    {
      name: "Announcements",
      path: "/admin/announcements",
      role: ["admin"],
    },
    {
      name: "Network",
      path: "/user/network",
      role: ["user"],
    },
    {
      name: "Register",
      path: "/user/register",
      role: ["user"],
    },
    {
      name: "Products",
      path: "/user/products",
      role: ["user"],
    },
    {
      name: "Deposit Funds",
      path: "/user/deposit",
      role: ["user"],
    },
    {
      name: "Transfer Funds",
      path: "/user/transfer",
      role: ["user"],
    },
    {
      name: "E-Wallet Transfer",
      path: "/user/ewallet-transfer",
      role: ["user"],
    },
    {
      name: "AllTransactions",
      path: "/user/transactions",
      role: ["user"],
    },
    {
      name: "Stockist",
      path: "/admin/stockist",
      role: ["admin"],
    },
    {
      name: "Contact",
      path: "/admin/contact",
      role: ["admin"],
    },
    {
      name: "Upgrade Package",
      path: "/user/upgrade-package",
      role: ["user"],
    },
    {
      name: "Stockist",
      path: "/user/stockistuser",
      role: ["user"],
    },
    {
      name: "Profile",
      path: "/user/profile",
      role: ["user"],
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      role: ["admin"],
    },
    {
      name: "Product Upload",
      path: "/admin/product-upload",
      role: ["admin"],
    },
    {
      name: "Package Upload",
      path: "/admin/package-upload",
      role: ["admin"],
    },
  ];

  const filteredLinks = navItems.filter(
    (navItem) =>
      Array.isArray(navItem.role) && navItem.role.includes(user?.role)
  );
  const userName = `${user?.first_name} ${user?.last_name}`;

  return (
    <div>
      <nav className="w-full bg-white flex items-center justify-between gap-6 lg:px-8 px-4 md:py-2 py-4 shadow-md">
        <div className="flex w-[calc(100%-152px-24px)] items-center md:gap-6 gap-3 overflow-hidden">
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

          {/* Scrollable links section */}
          <div className="relative flex items-center overflow-hidden w-3/4">
            {/* Left scroll */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 bg-tetiary text-primary w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:scale-105 transition"
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
            )}

            {/* Links */}
            <ul
              ref={scrollRef}
              className={`md:flex hidden flex-nowrap items-center gap-4 overflow-x-scroll no-scrollbar scroll-smooth flex-1 ${
                canScrollLeft ? "ps-10" : ""
              } pe-10`}
            >
              {filteredLinks.map(({ name, path }, index) => (
                <NavLink
                  to={path}
                  key={index}
                  className={({ isActive }) =>
                    `nav-links relative whitespace-nowrap text-black cursor-pointer py-1 ${
                      isActive
                        ? "active text-primary !font-extrabold text-base"
                        : "font-medium text-sm"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </NavLink>
              ))}
            </ul>

            {/* Right scroll */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 bg-tetiary text-primary w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:scale-105 transition"
              >
                <MdKeyboardDoubleArrowRight />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary">
            <GoBellFill />
          </button>
          <Link
            to={"/user/cart"}
            className="relative w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary"
          >
            {cartItem !== 0 && (
              <p className="absolute bottom-[1.4rem] left-[1.4rem] text-sm bg-primary text-[#EFF7F0] px-[7px] py-[1px] rounded-full">
                {cartItem !== 0 ? cartItem : " "}
              </p>
            )}
            <IoMdCart />
          </Link>
          <Link
            to={"/user/profile"}
            className="w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl bg-tetiary text-primary"
          >
            <h3>
              {" "}
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </h3>
          </Link>
        </div>
      </nav>

      <nav
        className={`fixed top-0 left-0 z-999 w-full h-screen bg-tetiary flex flex-col items-center justify-between gap-6 px-4 py-6 shadow-md ${
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
          <ul className="flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar">
            {
              // filteredLinks.map(({ name, path }, index) => (
              filteredLinks.map(({ name, path }, index) => (
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
        <div className="flex items-center gap-4 w-full text-center pt-4 border-t border-black/50">
          <button className="flex gap-4 justify-center items-center mx-auto rounded-full font-medium text-xl bg-tetiary text-primary">
            <IoIosLogOut size={30} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
