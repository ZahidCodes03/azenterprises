import { Link } from "react-router-dom";
import { FiPhone, FiCalendar, FiSun, FiZap, FiArrowRight } from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 bg-white/5"></div>
      </div>

      {/* Sun decoration */}
      <div className="absolute top-20 right-10 lg:right-32 opacity-20">
        <FiSun className="w-48 h-48 lg:w-72 lg:h-72 text-yellow-300 animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 pt-32 pb-20 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm animate-fade-in">
            <FiZap className="w-4 h-4 text-yellow-400" />
            <span>Government Approved Installation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Save Money with
            <span className="block text-yellow-300">Solar Energy</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Government Approved Solar Installation with PM Surya Ghar Subsidy
            Support. Get up to ₹95,000 subsidy on your solar installation.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <a href="tel:7006031785" className="btn-outline group">
              <FiPhone className="w-5 h-5 mr-2" />
              Call Now
            </a>

            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-300 group"
            >
              <FiCalendar className="w-5 h-5 mr-2" />
              Book Site Survey
              <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">500+</p>
              <p className="text-sm text-white/60 mt-1">Installations</p>
            </div>

            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">25</p>
              <p className="text-sm text-white/60 mt-1">Years Warranty</p>
            </div>

            <div>
              <p className="text-3xl lg:text-4xl font-bold text-white">₹95K</p>
              <p className="text-sm text-white/60 mt-1">Max Subsidy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z"
            fill="white"
          />
        </svg>
      </div>

    </section>
  );
};

export default HeroSection;
