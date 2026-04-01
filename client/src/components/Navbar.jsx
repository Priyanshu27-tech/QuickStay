import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isOwner, setShowHotelReg, logout } = useAppContext();

  useEffect(() => {

    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [location.pathname]);


  const handleOwnerClick = () => {
    if (isOwner) navigate("/owner");
    else setShowHotelReg(true);
  };


  // Scroll to testimonial section
  const handleExperienceClick = () => {

    setIsMenuOpen(false);

    if (location.pathname !== "/") {

      navigate("/");

      setTimeout(() => {
        document
          .getElementById("testimonials")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } else {

      document
        .getElementById("testimonials")
        ?.scrollIntoView({ behavior: "smooth" });

    }
  };


  // Scroll to footer
  const handleAboutClick = () => {

    setIsMenuOpen(false);

    if (location.pathname !== "/") {

      navigate("/");

      setTimeout(() => {
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } else {

      document
        .getElementById("about")
        ?.scrollIntoView({ behavior: "smooth" });

    }
  };


  return (

    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6 text-white"
      }`}
    >

      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>


      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">

        {navLinks.map((link, i) => (

          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}

            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />

          </Link>

        ))}


        {/* Experience */}
        <button
          onClick={handleExperienceClick}
          className={`group flex flex-col gap-0.5 bg-transparent border-none cursor-pointer ${
            isScrolled ? "text-gray-700" : "text-white"
          }`}
        >
          Experience

          <div
            className={`${
              isScrolled ? "bg-gray-700" : "bg-white"
            } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
          />

        </button>


        {/* About */}
        <button
          onClick={handleAboutClick}
          className={`group flex flex-col gap-0.5 bg-transparent border-none cursor-pointer ${
            isScrolled ? "text-gray-700" : "text-white"
          }`}
        >
          About

          <div
            className={`${
              isScrolled ? "bg-gray-700" : "bg-white"
            } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
          />

        </button>


        {user && (

          <button
            className={`border px-4 py-1 text-sm font-light rounded-full ${
              isScrolled ? "text-black" : "text-white"
            }`}
            onClick={handleOwnerClick}
          >
            {isOwner ? "Dashboard" : "List Your Hotel"}
          </button>

        )}

      </div>


      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">

        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled && "invert"} h-7`}
        />

        {user ? (

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/my-bookings")}
              className="text-sm"
            >
              My Bookings
            </button>

            <button
              onClick={logout}
              className="px-4 py-1 bg-red-500 text-white rounded-full text-sm"
            >
              Logout
            </button>

          </div>

        ) : (

          <button
            onClick={() => navigate("/login")}
            className={`px-8 py-2.5 rounded-full ${
              isScrolled ? "text-white bg-black" : "bg-white text-black"
            }`}
          >
            Login
          </button>

        )}

      </div>


      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">

        {user && (
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-sm"
          >
            Bookings
          </button>
        )}

        <img
          src={assets.menuIcon}
          alt="menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${isScrolled && "invert"} h-4`}
        />

      </div>


      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 md:hidden transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close" className="h-6" />
        </button>


        {navLinks.map((link, i) => (

          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>

        ))}


        <button onClick={handleExperienceClick}>
          Experience
        </button>

        <button onClick={handleAboutClick}>
          About
        </button>


        {user && (

          <button
            className="border px-4 py-1 rounded-full"
            onClick={() => {
              setIsMenuOpen(false);
              handleOwnerClick();
            }}
          >
            {isOwner ? "Dashboard" : "List Your Hotel"}
          </button>

        )}


        {user ? (

          <button
            onClick={logout}
            className="bg-red-500 text-white px-8 py-2.5 rounded-full"
          >
            Logout
          </button>

        ) : (

          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>

        )}

      </div>

    </nav>

  );

};

export default Navbar;