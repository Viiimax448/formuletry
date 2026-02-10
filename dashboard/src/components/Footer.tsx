import Link from "next/link";

export default function Footer() {
	return (
		<footer className="my-8 text-sm text-zinc-500">
			<div className="mb-4 flex flex-wrap gap-2">
				<p>
					Made with ♥ by <TextLink website="https://x.com/MaximoLXXXI">MaximoLXXXI</TextLink>.
				</p>

				<p>
					<TextLink website="https://cafecito.app/formuletry">Invitame un tecito</TextLink> para apoyar el proyecto.
				</p>

				<p>
					Contribuí en <TextLink website="https://github.com/Viiimax448/formuletry">GitHub</TextLink>.
				</p>

				<p>
					Únite a la comunidad en <TextLink website="https://discord.gg/unJwu66NuB">Discord</TextLink>.
				</p>

				<p>
					Get{" "}
					<Link className="text-blue-500" href="/help">
						Help
					</Link>
					.
				</p>

				<p>Version: {process.env.version}</p>
			</div>

			<p>
				This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA
				ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One
				Licensing B.V.
			</p>
		</footer>
	);
}

type TextLinkProps = {
	website: string;
	children: string;
};

const TextLink = ({ website, children }: TextLinkProps) => {
	return (
		<a className="text-blue-500" target="_blank" href={website}>
			{children}
		</a>
	);
};
