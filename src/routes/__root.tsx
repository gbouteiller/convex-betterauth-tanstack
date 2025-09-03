/// <reference types="vite/client" />

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createRootRouteWithContext, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import type { ConvexHttpClient } from "convex/browser";
import type { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "@/lib/theme";
import appCss from "@/styles/app.css?url";
import "@fontsource/geist-sans";

export const Route = createRootRouteWithContext<{ convex: ConvexReactClient; convexServer: ConvexHttpClient }>()({
	head: () => ({
		meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "tanstack-betterauth" }],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/convex.svg" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	const { convex } = Route.useRouteContext();

	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</ConvexBetterAuthProvider>
	);
}

function RootDocument({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<header className="p-2 border-b-1">
						<Button variant="ghost">
							<Link to="/">Home</Link>
						</Button>
						<Button variant="ghost">
							<Link to="/admin">Admin</Link>
						</Button>
					</header>
					<main className="p-10">{children}</main>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
