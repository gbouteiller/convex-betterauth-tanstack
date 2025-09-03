/// <reference types="vite/client" />

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createRootRouteWithContext, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";
import type { ConvexHttpClient } from "convex/browser";
import type { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { fetchSession, getCookieName } from "@/lib/auth-server-utils";
import appCss from "@/styles/app.css?url";

const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
	const sessionCookieName = await getCookieName();
	const token = getCookie(sessionCookieName);
	const request = getWebRequest();
	const { session } = await fetchSession(request);
	return {
		userId: session?.user.id,
		token,
	};
});

export const Route = createRootRouteWithContext<{ convex: ConvexReactClient; convexServer: ConvexHttpClient }>()({
	head: () => ({
		meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "tanstack-betterauth" }],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	// beforeLoad: async (ctx) => {
	// 	// all queries, mutations and action made with TanStack Query will be
	// 	// authenticated by an identity token.
	// 	const auth = await fetchAuth();
	// 	const { userId, token } = auth;

	// 	// During SSR only (the only time serverHttpClient exists),
	// 	// set the auth token for Convex to make HTTP queries with.
	// 	// if (token) {
	// 	//   ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
	// 	// }

	// 	return { userId, token };
	// },
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
				<header className="p-2 border-b-1">
					<Button variant="ghost">
						<Link to="/">Home</Link>
					</Button>
					<Button variant="ghost">
						<Link to="/admin">Admin</Link>
					</Button>
				</header>
				<main className="p-10">{children}</main>
				<Scripts />
			</body>
		</html>
	);
}
