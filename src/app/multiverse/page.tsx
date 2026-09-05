export const metadata = {
  title: "Multiverse Adventures",
  description: "Playable browser prototype of Multiverse Adventures",
};

export default function MultiversePage() {
  return (
    <main style={{ margin: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#06121d" }}>
      <iframe
        src="/multiverse/index.html"
        title="Multiverse Adventures"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="fullscreen"
      />
    </main>
  );
}
