import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{ background: "#f8f9fa", padding: "60px 0", textAlign: "center" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ margin: "0 10px", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            to="/privacy"
            style={{ margin: "0 10px", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
          {/* Add more links as needed */}
        </div>
        <div>
          <p>
            &copy; {new Date().getFullYear()} Digital Megazen. All rights
            reserved.
          </p>
          <p>
            Contact us:{" "}
            <a href="mailto:[Your Email Address]">mmarew@gmail.com</a> |
            +251922112480
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
