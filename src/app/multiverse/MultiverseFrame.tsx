"use client";

import { useRef } from "react";

export default function MultiverseFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const injectEnhancements = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    const loadScript = (id: string, src: string) => {
      if (doc.getElementById(id)) return;
      const script = doc.createElement("script");
      script.id = id;
      script.src = src;
      script.async = false;
      doc.body.appendChild(script);
    };

    loadScript("multiverse-summon", "/multiverse/summon.js?v=091");
    loadScript("multiverse-visual", "/multiverse/visual.js?v=100");
    loadScript("multiverse-menu-visual", "/multiverse/menu-visual.js?v=101");
  };

  return (
    <iframe
      ref={frameRef}
      src="/multiverse/index.html?v=101"
      title="Multiverse Adventures"
      onLoad={injectEnhancements}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      allow="fullscreen"
    />
  );
}
