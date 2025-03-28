import React, { useEffect } from "react";

const StarryBackground = () => {
  useEffect(() => {
    // create stars
    const createStars = () => {
      const container = document.getElementById("starry-bg");
      // clear existing content
      if (container) {
        container.innerHTML = "";

        // create stars
        for (let i = 0; i < 150; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.left = `${Math.random() * 100}vw`;
          star.style.top = `${Math.random() * 100}vh`;
          star.style.animation = `twinkle ${
            2 + Math.random() * 3
          }s ease-in-out infinite`;
          star.style.animationDelay = `${Math.random() * 2}s`;
          container.appendChild(star);
        }

        // create 3 blue orbs
        for (let i = 0; i < 3; i++) {
          const orb = document.createElement("div");
          orb.className = "blue-orb";
          orb.style.left = `${Math.random() * 100}vw`;
          orb.style.top = `${Math.random() * 100}vh`;
          container.appendChild(orb);
        }

        // create 3 green orbs
        for (let i = 0; i < 3; i++) {
          const orb = document.createElement("div");
          orb.className = "green-orb";
          orb.style.left = `${Math.random() * 100}vw`;
          orb.style.top = `${Math.random() * 100}vh`;
          container.appendChild(orb);
        }
      }
    };

    createStars();

    // cleanup function
    return () => {
      const container = document.getElementById("starry-bg");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return <div id="starry-bg" className="fixed inset-0 -z-10" />;
};

export default StarryBackground;
