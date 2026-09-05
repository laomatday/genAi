"use client";

import { useRef } from "react";

export default function MultiverseFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const injectSummon = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc || doc.getElementById("multiverse-summon")) return;

    const script = doc.createElement("script");
    script.id = "multiverse-summon";
    script.src = "/multiverse/summon.js?v=090";
    script.async = false;
    doc.body.appendChild(script);
  };

  return (
    <iframe
      ref={frameRef}
      src="/multiverse/index.html?v=090"
      title="Multiverse Adventures"
      onLoad={injectSummon}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      allow="fullscreen"
    />
  );
}
