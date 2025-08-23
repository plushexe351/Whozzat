import React, { useState, useRef } from "react";
import "./FooterFAQ.scss";

const faqItems = [
  {
    question: "Why do I need a link in bio tool?",
    answer:
      "It lets you share multiple links from a single profile URL, helping you connect all your content and platforms easily.",
  },

  {
    question: "Is Whozzat safe to use on all of my social media profiles?",
    answer:
      "Yes, it's widely accepted and safe to use on platforms like Instagram, TikTok, and Twitter.",
  },
  {
    question: "What makes Whozzat better than the other link in bio options?",
    answer:
      "It offers customization, analytics, integrations, and ease of use. On top of that, the UI is pretty sweet isn't it?",
  },
  {
    question: "How can I drive more traffic to and through my Whozzat?",
    answer:
      "Use eye-catching thumbnails, compelling CTAs, and regularly update your links to stay relevant.",
  },
  {
    question: "How many links should I have on my Whozzat?",
    answer:
      "Ideally, keep it between 3 to 7. Too many links can reduce click-through rates.",
  },
  {
    question: "Do I need a website to use Whozzat?",
    answer:
      "Nope! A link-in-bio tool acts as a mini-website, especially useful if you don't have a full website.",
  },
  {
    question: "Where can I download the app?",
    answer: "Whozzat is currently available only for the web.",
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen((prev) => !prev)}>
        {question}
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      <div
        className="faq-answer"
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current.scrollHeight}px` : "0px",
        }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FooterFAQ = () => {
  return (
    <footer className="faq-footer">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <FAQItem key={index} {...item} />
        ))}
      </div>
    </footer>
  );
};

export default FooterFAQ;
