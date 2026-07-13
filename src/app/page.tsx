import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Writing from "@/components/Writing";
import Interests from "@/components/Interests";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Writing />
        <Interests />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
