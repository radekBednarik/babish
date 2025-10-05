import type { JSX } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

type TimeParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE_LOCAL = new Date(2029, 9, 3, 0, 0, 0, 0); // 3. 10. 2029, 00:00 (místní)

function addYears(d: Date, years: number): Date {
  const copy = new Date(d);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

function addMonths(d: Date, months: number): Date {
  const copy = new Date(d);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function diffParts(from: Date, to: Date): TimeParts {
  if (from >= to) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let pivot = new Date(from);
  pivot.setMilliseconds(0);

  let years = 0;
  while (addYears(pivot, 1) <= to) {
    pivot = addYears(pivot, 1);
    years++;
  }

  let months = 0;
  while (addMonths(pivot, 1) <= to) {
    pivot = addMonths(pivot, 1);
    months++;
  }

  const remainingMs = to.getTime() - pivot.getTime();
  const days = Math.floor(remainingMs / 86_400_000);
  const hours = Math.floor((remainingMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
  const seconds = Math.floor((remainingMs % 60_000) / 1_000);

  return { years, months, days, hours, minutes, seconds };
}

function Countdown(): JSX.Element {
  const target = useMemo(() => TARGET_DATE_LOCAL, []);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => diffParts(now, target), [now, target]);
  const reached = now >= target;

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5">
        {[
          { label: "Roky", value: parts.years },
          { label: "Měsíce", value: parts.months },
          { label: "Dny", value: parts.days },
          { label: "Hodiny", value: parts.hours },
          { label: "Minuty", value: parts.minutes },
          { label: "Sekundy", value: parts.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/5 supports-[backdrop-filter]:bg-white/5 backdrop-blur-lg ring-1 ring-white/10 p-4 md:p-6 text-center shadow-[0_10px_30px_-10px_rgba(16,24,40,0.45)]"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl font-semibold tabular-nums tracking-tight text-white">
              {item.value}
            </div>
            <div className="mt-1 text-[11px] sm:text-xs md:text-sm text-slate-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      {reached ? (
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            Je čas voleb. Nezapomeňte jít volit!
          </span>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-300 ring-1 ring-white/15">
            Cíl: 3. 10. 2029, 00:00 (místní čas)
          </span>
        </div>
      )}
    </section>
  );
}

export function App(): JSX.Element {
  return (
    <div className="mx-auto max-w-5xl min-h-dvh flex flex-col gap-8 md:gap-12 px-4 md:px-6 py-8 md:py-14">
      <header className="flex items-center gap-5 md:gap-6">
        <img
          src="/andrej.webp"
          alt="Karikatura Andreje Babiše – kopanec do zadku"
          className="size-20 md:size-24 rounded-xl ring-1 ring-white/15 shadow-lg"
          width={160}
          height={120}
          loading="lazy"
        />
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Kolik času zbývá, než Babiš vypadne?
            </span>
          </h1>
          <p className="mt-1.5 text-base md:text-lg text-slate-400">
            Odpočítáváme 4 roky od 3. 10. 2025 → 3. 10. 2029
          </p>
        </div>
      </header>

      <main className="flex-1 mt-8 md:mt-12">
        <Countdown />
      </main>

      <footer className="border-t border-white/10 pt-6 text-center text-[11px] text-slate-400">
        Pouze informativní. Není spojeno s žádnou institucí.
        <span className="mx-2">•</span>
        <a
          href="https://github.com/radekBednarik/babish"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-300"
        >
          Repozitář na GitHubu
        </a>
      </footer>
    </div>
  );
}
