import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiPhone, FiSun } from "react-icons/fi";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: "Packages", path: "/#packages" },
    { name: "Subsidy", path: "/#subsidy" },
    { name: "Gallery", path: "/#gallery" },
    { name: "Testimonials", path: "/#testimonials" },
    { name: "Contact", path: "/#contact" },
  ];

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);

    if (path.includes("#")) {
      const sectionId = path.split("#")[1];

      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white/95 py-4"
      }`}
    >
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo + Company Name */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg">
              <FiSun className="w-7 h-7 text-white" />
            </div>

            {/* ✅ Now visible on Mobile also */}
            <div className="flex flex-col leading-tight">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                A Z ENTERPRISES
              </h1>
              <p className="text-[10px] sm:text-xs text-primary-600 font-medium">
                Solar Distributors / Installation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="tel:7006031785"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-800 transition-all"
            >
              <FiPhone className="w-4 h-4" />
              <span>7006031785</span>
            </a>

            <Link to="/booking" className="btn-primary text-sm py-2.5">
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 mt-2">
                <a
                  href="tel:7006031785"
                  className="flex items-center space-x-2 px-4 py-3 text-primary-700 font-medium"
                >
                  <FiPhone className="w-5 h-5" />
                  <span>7006031785</span>
                </a>

                <Link
                  to="/booking"
                  className="block mx-4 mt-2 text-center btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Free Quote
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
