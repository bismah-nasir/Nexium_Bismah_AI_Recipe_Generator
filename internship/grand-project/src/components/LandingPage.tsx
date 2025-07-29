import Navbar from "./Navbar";
import HeroSection from "../components/landing/HeroSection";
import AboutUs from "../components/landing/AboutUs";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <AboutUs />
            <HowItWorks />
            <Features />
            <Footer />
        </>
    );
}
