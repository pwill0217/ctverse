// src/components/KofiWidget.tsx
import { useEffect, useState } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options?: Record<string, unknown>) => void;
    };
  }
}


const KofiWidget = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector("#kofi-script")) {
      setLoaded(true);
      return;
    }

    const kofiScript = document.createElement("script");
    kofiScript.src =
      "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    kofiScript.async = true;
    kofiScript.id = "kofi-script";
    kofiScript.addEventListener("load", () => setLoaded(true));

    document.body.appendChild(kofiScript);

    return () => {
      // Optional cleanup if you only want one instance
      // document.body.removeChild(kofiScript);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !window.kofiWidgetOverlay) return;

    window.kofiWidgetOverlay.draw("ctverse", {
      type: "floating-chat",
      "floating-chat.donateButton.text": "Support me",
      "floating-chat.donateButton.background-color": "#f21111",
      "floating-chat.donateButton.text-color": "#fff",
    });
  }, [loaded]);

  return null; // component doesn’t render UI, just injects widget
};

export default KofiWidget;
