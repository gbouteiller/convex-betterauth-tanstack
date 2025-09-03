import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { api } from "convex/_generated/api";
import { usePreloadedQuery } from "convex/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getCookieName } from "@/lib/auth-server-utils";
import { preloadQuery } from "@/lib/convex";

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
	const sessionCookieName = await getCookieName();
	const token = getCookie(sessionCookieName);
	if (!token) throw redirect({ to: "/signin" });
	return { token };
});

export const Route = createFileRoute("/admin")({
	beforeLoad: async ({ context: { convexServer } }) => {
		const { token } = await authStateFn();
		convexServer.setAuth(token);
	},
	component: RouteComponent,
	loader: async ({ context: { convexServer } }) => preloadQuery(convexServer, api.auth.getUserEmail),
});

function RouteComponent() {
	const preloaded = Route.useLoaderData();
	const email = usePreloadedQuery(preloaded);

	const navigate = useNavigate();
	const handleClick = useCallback(() => void authClient.signOut({}, { onSuccess: () => navigate({ to: "/" }) }), [navigate]);

	return (
		<div className="flex flex-col gap-2">
			<div>Email : {email}</div>
			<Button variant="secondary" className="cursor-pointer" onClick={handleClick}>
				Sign out
			</Button>
		</div>
	);
}
