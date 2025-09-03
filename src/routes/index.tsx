import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async ({ context: { convexServer } }) => await convexServer.query(api.pages.home),
});

function Home() {
	const title = Route.useLoaderData();
	return <div>{title}</div>;
}
