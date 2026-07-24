import { Navbar } from '@/components/layout';
import { Hero, Statistics, Ecosystem, Services, WhyScholatia, CallToAction } from '@/components/home';
import { Footer } from '@/components/layout';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Statistics />
      <Ecosystem />
      <Services />
      <WhyScholatia />
      <CallToAction />
      <Footer />
    </main>
  );
}
