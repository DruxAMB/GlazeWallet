import { AmbientBackground } from "@/components/ambient-background";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Onboarding } from "@/components/onboarding";
import { Security } from "@/components/security";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Onboarding />
        <Features />
        <Security />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
