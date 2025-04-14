import Flow from "./components/Flow";
import { Footer } from "./components/Footer";
import { Hero } from "./components//Hero";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <div>
        <Navbar/>
        <Hero/>
        <Flow/>
        <Footer/>
        <Toaster/>
      </div>
    </>
  );
}