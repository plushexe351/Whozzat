import { motion } from "framer-motion";
import "./Landing.scss";
import { useToast } from "../../Context/ToastContext";

import {
  ArrowUpRight,
  ChartArea,
  Folders,
  Globe,
  Link,
  Search,
  Smartphone,
  X,
} from "lucide-react";
import FooterFAQ from "../../Components/FooterFAQ/FooterFAQ";
import mockup from "../../assets/mockup.png";
import row1img1 from "../../assets/row1img1.png";
import row2img1 from "../../assets/row2img1.png";
import { useUI } from "../../Context/UIContext";
import Menubar from "../../Components/Menubar/Menubar";

import github from "../../assets/github.png";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.png";
import twitter from "../../assets/twitter.png";
import weblink from "../../assets/weblink.png";
import tiktok from "../../assets/tiktok.png";
import youtube from "../../assets/youtube.png";

import { useNavigate, Link as RouterLink } from "react-router";
import Footer from "../../Components/Footer/Footer";

const socials = [
  github,
  instagram,
  linkedin,
  twitter,
  weblink,
  tiktok,
  youtube,
];

const Landing = () => {
  const { addToast } = useToast();
  const { showGreet, setShowGreet } = useUI();
  const Navigate = useNavigate();
  return (
    <>
      <Menubar />
      <motion.div
        className="Landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.section id="about" className="hero main">
          <div className="hero-main">
            <div
              className="hero-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {showGreet && (
                <div className="greet">
                  <p>Hey ⚡️ Welcome to Whozzat !</p>
                  <div
                    className="close-greet"
                    onClick={() => setShowGreet(false)}
                  >
                    <X size={20} />
                  </div>
                </div>
              )}
              <motion.div className="heading">
                <div className="row">
                  Empower
                  <div className="empower-by-metric">
                    <div className="icon">
                      <ArrowUpRight size={50} />
                    </div>
                    <span>92%</span>
                  </div>
                  Your
                </div>
                <div className="socials">
                  {socials.map((social, idx) => (
                    <img src={social} alt="" className="social" key={idx} />
                  ))}
                  <p>👍</p>
                </div>
                <div className="row">Digital Presence</div>
              </motion.div>
              <p className="description">
                Stop digging through notes and tabs. Save, manage, and share all
                your links in one clean, secure place.
              </p>
              <div className="call-to-actions">
                <button
                  className="get-started"
                  onClick={() => Navigate("/auth")}
                >
                  Get Started
                </button>
                <button className="watch-preview">Watch Preview</button>
              </div>
            </div>
            <div className="hero-visual">
              <motion.img
                src={mockup}
                alt=""
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>
        </motion.section>
        <section id="why-us" className="hero showcase">
          <div className="row">
            <div>
              <div className="row-text">
                {" "}
                <div className="icon-container">
                  <Link className="icon" />
                </div>
                Everything in one link
              </div>
              <img src={row1img1} alt="" className="row-img" />
            </div>
            <div>
              <div className="row-text">
                <div className="icon-container">
                  <ChartArea className="icon" />
                </div>
                Smart Insights
              </div>
              <div className="row-pills">
                <div className="pill">Activity</div>
                <div className="pill">Click through rate</div>
                <div className="pill">Engagement Score</div>
                <div className="pill">Traffic by device</div>
                <div className="pill">Who viewed your profile</div> + more
              </div>
            </div>
          </div>
          <div className="row">
            <div>
              <div className="row-text">
                <div className="icon-container">
                  <Folders className="icon" />
                </div>
                Stay Organised with Categories
              </div>
              <div className="row-description-text">
                Separate your links for your different needs and choose exactly
                what to share with your peeps
              </div>
            </div>
            <div>
              <div className="row-text">
                <div className="icon-container">
                  <Smartphone className="icon" />
                </div>
                Made for Mobile Life
              </div>
              <img src={row2img1} alt="" className="row-img" />
            </div>
            <div>
              <div className="row-text">
                <div className="icon-container">
                  <Search className="icon" />
                </div>
                Discover and Connect
              </div>
              <div className="row-description-text">
                Find your audience, your people, creators, and convert visits to
                connections
              </div>
              <RouterLink className="row-CTA" to="/home">
                <Globe /> Explore
              </RouterLink>
            </div>
          </div>
        </section>

        <section id="faqs" className="faq">
          <FooterFAQ />
        </section>
        <Footer />
      </motion.div>
    </>
  );
};

export default Landing;
