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
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
						className="rounded-xl border border-gray-200 bg-white/60 p-4 text-center shadow-sm"
					>
						<div className="text-3xl md:text-4xl font-semibold tabular-nums">
							{item.value}
						</div>
						<div className="text-xs md:text-sm text-gray-600">{item.label}</div>
					</div>
				))}
			</div>
			{reached ? (
				<p className="mt-4 text-center text-green-700">
					Je čas voleb. Nezapomeňte jít volit!
				</p>
			) : (
				<p className="mt-4 text-center text-gray-700">
					Cíl: 3. 10. 2029, 00:00 (místní čas)
				</p>
			)}
		</section>
	);
}

export function App(): JSX.Element {
	return (
		<div className="container mx-auto min-h-screen flex flex-col gap-8 p-4 md:p-8">
			<header className="flex items-center gap-4">
				<img
					src="/andrej.png"
					alt="Karikatura Andreje Babiše – kopanec do zadku"
					className="w-28 h-auto md:w-40 rounded"
					width={160}
					height={120}
					loading="lazy"
				/>
				<div>
					<h1 className="text-2xl md:text-3xl font-bold">
						Kolik času zbývá, než Babiš vypadne?
					</h1>
					<p className="text-sm text-gray-600">
						Odpočítáváme 4 roky od 3. 10. 2025 → 3. 10. 2029
					</p>
				</div>
			</header>

			<main className="flex-1 flex items-center">
				<Countdown />
			</main>

			<footer className="text-center text-xs text-gray-500">
				Pouze informativní. Není spojeno s žádnou institucí.
			</footer>
		</div>
	);
}
