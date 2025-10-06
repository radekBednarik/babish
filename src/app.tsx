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

  const pad2 = (n: number): string => n.toString().padStart(2, "0");

  return (
    <section
      aria-label="Odpočet do parlamentních voleb 2029 (ČR)"
      className="w-full"
    >
      <div className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-zinc-900/50 py-3 md:py-4 font-mono tabular-nums text-xl md:text-2xl text-neutral-900 dark:text-zinc-100">
        <div className="mx-auto max-w-[72ch] px-2 md:px-0">
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2">
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Roky
              </span>
              <span className="opacity-60">:</span>
              <span>{parts.years}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Měsíce
              </span>
              <span className="opacity-60">:</span>
              <span>{parts.months}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Dny
              </span>
              <span className="opacity-60">:</span>
              <span>{parts.days}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Hodiny
              </span>
              <span className="opacity-60">:</span>
              <span>{pad2(parts.hours)}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Minuty
              </span>
              <span className="opacity-60">:</span>
              <span>{pad2(parts.minutes)}</span>
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="uppercase tracking-[0.08em] text-[0.75em] text-neutral-500 dark:text-neutral-400">
                Sekundy
              </span>
              <span className="opacity-60">:</span>
              <span>{pad2(parts.seconds)}</span>
            </span>
          </div>
        </div>
      </div>

      {reached ? (
        <div className="mt-3 text-center">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Je čas voleb. Nezapomeňte jít volit!
          </span>
        </div>
      ) : (
        <div className="mt-3 text-center">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Cíl: začátek parlamentních voleb — 3. 10. 2029, 00:00 (místní čas)
          </span>
        </div>
      )}
    </section>
  );
}

export function App(): JSX.Element {
  return (
    <div className="mx-auto max-w-[72ch] min-h-dvh flex flex-col gap-8 md:gap-10 px-4 md:px-0 py-8 md:py-12">
      <header className="pt-2">
        <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
          Parlamentní volby ČR 2029
        </div>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Kolik času zbývá, než Babiš vypadne?
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Odpočítáváme čas do parlamentních voleb v roce 2029
        </p>
      </header>

      <main className="flex-1 mt-6 md:mt-8">
        <Countdown />

        <article className="mt-8 md:mt-10">
          <figure className="my-4 md:my-6">
            <img
              src="/andrej.webp"
              alt="Karikatura Andreje Babiše – kopanec do zadku"
              className="w-full md:w-auto md:float-right md:ml-6 md:mb-2 border border-neutral-200 dark:border-neutral-800"
              width={160}
              height={120}
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Karikatura Andreje Babiše – kopanec do zadku
            </figcaption>
          </figure>

          <p className="mt-4 text-[1.05rem] leading-7 first-letter:float-left first-letter:mr-3 first-letter:text-6xl md:first-letter:text-7xl first-letter:leading-[0.9] first-letter:font-bold first-letter:text-neutral-800 dark:first-letter:text-neutral-200">
            Odpočet do parlamentních voleb v ČR v roce 2029. Tato stránka
            zobrazuje zbývající roky, měsíce, dny, hodiny, minuty a sekundy do
            začátku hlasování.
          </p>

          <div className="clear-both" />
        </article>
      </main>

      <footer className="mt-10 border-t border-neutral-200 dark:border-neutral-800 pt-6 text-center text-[11px] text-neutral-500">
        Pouze informativní. Není spojeno s žádnou institucí.
        <span className="mx-2">•</span>
        <a
          href="https://github.com/radekBednarik/babish"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Repozitář na GitHubu
        </a>
      </footer>
    </div>
  );
}
