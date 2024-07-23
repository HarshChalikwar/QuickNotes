import React from "react";
import "./About.css"; // Import custom CSS for additional styling

const About = () => {
  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover QuickNotes</h1>
          <p>
            Elevate your note-taking experience with simplicity and elegance.
          </p>
        </div>
      </section>
      <section className="content-section">
        <div className="about-card">
          <h2>Our Story</h2>
          <p>
            QuickNotes was built with the goal of making note-taking effortless
            and enjoyable. Our team is dedicated to providing a seamless
            experience that helps you stay organized and focused.
          </p>
          <h3>Key Features:</h3>
          <div className="features-list">
            <div className="feature-item">
              Organize notes with tags and categories
            </div>
            <div className="feature-item">Responsive and clean interface</div>
            <div className="feature-item">Secure and simple authentication</div>
            <div className="feature-item">Sync across devices effortlessly</div>
          </div>
          <h3>Get in Touch:</h3>
          <p>
            We’d love to hear from you! Reach out to us at{" "}
            <a href="support@quicknotes.com" className="contact-link">
              support@quicknotes.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
