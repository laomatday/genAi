import MultiverseFrame from "./MultiverseFrame";

export const metadata = {
  title: "Multiverse Adventures",
  description: "Playable browser prototype of Multiverse Adventures",
};

export default function MultiversePage() {
  return (
    <main style={{ margin: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#06121d" }}>
      <MultiverseFrame />
    </main>
  );
}
