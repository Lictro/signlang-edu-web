"use client";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-32 px-4 bg-gradient-to-br from-brand-light to-brand-green">
      <h1 className="text-5xl font-bold text-brand-dark mb-4">
        Welcome to SignAI
      </h1>
      <p className="text-xl text-brand-teal mb-8 max-w-xl">
        AI-powered sign language recognition. Learn, detect, and practice signs effortlessly.
      </p>
      <a
        href="/detect"
        className="bg-brand-green hover:bg-brand-teal text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        Start Detecting
      </a>
    </section>
  );
}
