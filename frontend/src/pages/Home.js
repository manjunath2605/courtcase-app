import HeroSection from '../components/marketing/HeroSection';
import PracticeAreaSection from '../components/marketing/PracticeAreaSection';
import AboutSection from '../components/marketing/AboutSection';
import TestimonialSection from '../components/marketing/TestimonialSection';
import ContactSection from '../components/marketing/ContactSection';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GallerySection from '../components/marketing/GallerySection';

export default function Home() {
    const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "services") {
      setTimeout(() => {
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);
  return (
    <>
      <HeroSection />
      <PracticeAreaSection />
      <AboutSection />
      <GallerySection />
      <TestimonialSection />
      
      <ContactSection />
    </>
  );
}
