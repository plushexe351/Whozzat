import React from "react";
import Menubar from "../../Components/Menubar/Menubar";
import Profile from "../Home/HomeOutlets/Profile/Profile";

const PublicProfile = () => {
  return (
    <div className="PublicProfilePage" style={{ background: "var(--fg-dark)" }}>
      <Menubar />
      <div
        className="public-profile-content"
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          padding: "0 1rem 1rem 1rem",
        }}
      >
        <Profile />
      </div>
    </div>
  );
};

export default PublicProfile;
