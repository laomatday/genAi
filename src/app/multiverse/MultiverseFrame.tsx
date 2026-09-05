"use client";

import { useRef } from "react";

export default function MultiverseFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const injectLevel2 = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc || doc.getElementById("multiverse-level2")) return;

    const script = doc.createElement("script");
    script.id = "multiverse-level2";
    script.src = "/multiverse/level2.js?v=070";
    script.async = false;
    doc.body.appendChild(script);
  };

  return (
    <iframe
      ref={frameRef}
      src="/multiverse/index.html?v=062"
      title="Multiverse Adventures"
      onLoad={injectLevel2}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      allow="fullscreen"
    />
  );
}
