"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";

const slides = [
  {
    title: "More Members, More Revenue. Smarter Gym Management.",
    img: "/images/slide1.png",
  },
  {
    title: "Automate Payments, Retain Members Effortlessly",
    img: "/images/slide2.png",
  },
  {
    title: "Automate Payments, Retain Members Effortlessly",
    img: "/images/slide3.png",
  },
];

export default function Home() {
  const [idx, setIdx] = useState(0);

  // simple autoplay that pauses on hover via "pointer-events"
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (next: number) => setIdx((next + slides.length) % slides.length);
  return (
    <div className="min-h-screen lg:grid grid-cols-2">
      <div className="relative h-screen select-none">
        <Image
          src={slides[idx].img}
          alt={slides[idx].title}
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-3xl max-w-xl text-center w-full font-semibold drop-shadow">
          {slides[idx].title}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-3 h-3 rounded-full cursor-pointer hover:bg-green-500 ${
                i === idx ? "bg-green-500" : "bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-[480px] flex flex-col gap-10 lg:gap-18 items-center">
          <div className="flex flex-col gap-3 items-center">
            <div>
              <div className="text-[#28A745] text-2xl lg:text-[40px] text-center font-bold">
                Welcome to
              </div>
              {/* <div className="text-3xl font-bold text-green-600">WellVantage</div> */}
            </div>

            <Image src="/brand-logo.png" alt="Logo" width={294} height={70} />
          </div>
          <a
            href="/signup"
            className="inline-flex items-center justify-center max-w-[393px] h-[55px] w-full py-[13px] rounded-2xl bg-green-500 text-white font-bold text-lg px-2 lg:text-2xl hover:bg-green-600"
          >
            Gym Owner - Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
