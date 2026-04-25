import { createFileRoute } from "@tanstack/react-router";
import { StarField } from "@/components/StarField";
import { Petals } from "@/components/Petals";
import { AmbientAudio } from "@/components/AmbientAudio";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Timeline } from "@/components/Timeline";
import { Wish } from "@/components/Wish";

// Replace this with her real name 💛
const HER_NAME = "My Love";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Happy Birthday, ${HER_NAME} ✦` },
      { name: "description", content: "A little universe made just for you." },
      { property: "og:title", content: `Happy Birthday, ${HER_NAME} ✦` },
      { property: "og:description", content: "A little universe made just for you." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarField />
      <Petals />
      <AmbientAudio />
      <Hero name={HER_NAME} />
      <Gallery />
      <Timeline />
      <Wish name={HER_NAME} />
      <footer className="relative z-10 pb-10 text-center text-xs text-white/40">
        made with ✦ just for you
      </footer>
    </main>
  );
}
