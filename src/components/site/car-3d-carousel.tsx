import { useEffect, useState } from "react";
import { Car } from "lucide-react";

const CARS = [
  "Prado V8", "Revo", "Vigo", "Corolla", "Civic", "Bulletproof Prado",
  "Audi A3", "Audi A4", "Audi A5", "Audi A6",
  "Mercedes C Class", "Mercedes E Class", "Mercedes S Class", "Mercedes G Class",
  "BMW i8", "Porsche Panamera",
  "Rolls Royce", "Rolls Royce Replica", "Rolls Royce Limo",
  "Fortuner Sigma", "Fortuner Legender",
  "Range Rover Vogue", "Range Rover Sport", "Range Rover Autobiography",
  "Kia Carnival", "Kia Sorento", "Kia Sportage",
  "Honda BRV", "Honda Civic", "Corolla GLI", "Hyundai Sonata",
  "GMC Limousine", "Cadillac Limousine", "Tundra Limousine",
  "Hi Roof", "Grand Cabin", "Coaster Saloon",
  "Vintage Cars", "Open Roof Jeep",
];

export function Car3DCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CARS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-0 hidden sm:block"
      aria-hidden="true"
    >
      <div className="car3d-stage">
        <div
          className="car3d-ring"
          style={{ transform: `rotateY(${-idx * (360 / CARS.length)}deg)` }}
        >
          {CARS.map((name, i) => {
            const angle = (360 / CARS.length) * i;
            const active = i === idx;
            return (
              <div
                key={name}
                className="car3d-card"
                style={{ transform: `rotateY(${angle}deg) translateZ(220px)` }}
              >
                <div
                  className={`rounded-2xl border px-5 py-4 min-w-[190px] text-center backdrop-blur-md transition-all duration-500 ${
                    active
                      ? "bg-primary/90 border-primary text-white shadow-red scale-110"
                      : "bg-white/10 border-white/20 text-white/85"
                  }`}
                >
                  <Car className={`mx-auto size-6 ${active ? "text-white" : "text-primary"}`} />
                  <p className="mt-2 font-display text-base font-semibold whitespace-nowrap">
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .car3d-stage {
          width: 260px;
          height: 260px;
          perspective: 1400px;
        }
        @media (min-width: 768px) {
          .car3d-stage { width: 340px; height: 340px; perspective: 1800px; }
          .car3d-card > div { min-width: 220px; }
        }
        @media (min-width: 1024px) {
          .car3d-stage { width: 420px; height: 420px; }
        }
        .car3d-ring {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 900ms cubic-bezier(.22,.61,.36,1);
          animation: car3d-float 6s ease-in-out infinite;
        }
        .car3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          margin-left: -95px;
          margin-top: -34px;
        }
        @keyframes car3d-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -10px; }
        }
      `}</style>
    </div>
  );
}
