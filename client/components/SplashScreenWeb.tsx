import React from "react";

export default function SplashScreenWeb() {
  return (
    <div
      style={{
        backgroundColor: "#8A5F9E",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#F3F0EC",
      }}>
      <img
        src="/assets/favicon.png"
        alt="splash"
        style={{ width: 200, height: 200 }}
      />
      <h1 style={{ marginTop: 24, fontSize: 20 }}>
        Build a Stronger Core, One Plank at a Time
      </h1>
    </div>
  );
}
