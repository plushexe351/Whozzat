import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Landing.scss";
import { useToast } from "../../Context/ToastContext";

import { ArrowUpRight, X } from "lucide-react";
import FooterFAQ from "../../Components/FooterFAQ/FooterFAQ";
import mockup from "../../assets/mockup.png";
import { useUI } from "../../Context/UIContext";
import Menubar from "../../Components/Menubar/Menubar";

const Landing = () => {
  const { addToast } = useToast();
  const { showGreet, setShowGreet } = useUI();
  return (
    <>
      <Menubar />
      <motion.div
        className="Landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.section className="hero main">
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
                  <div className="social"></div>
                  <div className="social"></div>
                  <div className="social"></div>
                  <div className="social"></div>
                  <div className="social"></div>
                  <div className="social"></div>
                  <div className="social"></div>
                  <p>👍</p>
                </div>
                <div className="row">Digital Presence</div>
              </motion.div>
              <p className="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                provident alias voluptatibus fuga delectus laudantium, esse
                cumque tempore ea, consequuntur possimus? Ex nam nisi suscipit
                vel facilis nesciunt ipsa nemo.
              </p>
              <div className="call-to-actions">
                <button className="get-started">Get Started</button>
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
        <section className="hero showcase">
          <div className="row">
            <div></div>
            <div></div>
          </div>
          <div className="row">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </section>

        <section className="faq">
          <FooterFAQ />
        </section>
        <section className="footer"></section>
      </motion.div>
    </>
  );
};

export default Landing;
