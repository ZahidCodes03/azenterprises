import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import BenefitsStrip from '../components/BenefitsStrip';
import ServicesGrid from '../components/ServicesGrid';
import PricingPlans from '../components/PricingPlans';
import SubsidySteps from '../components/SubsidySteps';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        // Handle scroll to section from hash
        if (location.hash) {
            const sectionId = location.hash.substring(1);
            const element = document.getElementById(sectionId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <main>
            <HeroSection />
            <BenefitsStrip />
            <ServicesGrid />
            <PricingPlans />
            <SubsidySteps />
            <Gallery />
            <Testimonials />
            <ContactSection />
        </main>
    );
};

export default Home;
