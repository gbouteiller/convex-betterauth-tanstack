import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { api } from "convex/_generated/api";
import { usePreloadedQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getCookieName } from "@/lib/auth-server-utils";
import { preloadQuery } from "@/lib/convex";

// SERVER **********************************************************************************************************************************
const ensureAuthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
	const sessionCookieName = await getCookieName();
	const token = getCookie(sessionCookieName);
	if (!token) throw redirect({ to: "/signin" });
	return { token };
});

// ROUTE ***********************************************************************************************************************************
export const Route = createFileRoute("/admin")({
	beforeLoad: async ({ context: { convexServer } }) => {
		const { token } = await ensureAuthenticatedFn();
		convexServer.setAuth(token);
	},
	component: AdminPage,
	loader: async ({ context: { convexServer } }) => preloadQuery(convexServer, api.auth.getUserEmail),
});

// ROOT ************************************************************************************************************************************
function AdminPage() {
	const preloaded = Route.useLoaderData();
	const email = usePreloadedQuery(preloaded);

	const navigate = useNavigate();
	const handleClick = () => authClient.signOut({}, { onSuccess: () => navigate({ to: "/" }) });

	return (
		<div className="flex flex-col gap-2">
			<div>Email : {email}</div>
			<Button variant="secondary" className="cursor-pointer" onClick={handleClick}>
				Sign out
			</Button>
		</div>
	);
}
