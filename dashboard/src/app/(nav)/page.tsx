import Link from "next/link";

export default function Home() {
	return (
		<div className="flex h-screen w-full flex-col items-center pt-20 sm:justify-center sm:pt-0">
			<h1 className="my-20 text-center text-5xl font-bold">
				Welcome to F1 Dash
			</h1>

			<div className="flex flex-wrap gap-4">
				<Link href="/dashboard">
					<button className="rounded-xl border-2 border-transparent p-4 font-medium bg-zinc-800 text-white">
						Go to Dashboard
					</button>
				</Link>

				<Link href="/schedule">
					<button className="rounded-xl border-2 border-zinc-700 bg-transparent p-4 font-medium text-white">
						Check Schedule
					</button>
				</Link>
			</div>
		</div>
	);
}
