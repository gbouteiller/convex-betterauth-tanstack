import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { ConvexHttpClient } from "convex/browser";
import { ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!;
	if (!CONVEX_URL) {
		throw new Error("missing VITE_CONVEX_URL envar");
	}
	const convex = new ConvexReactClient(CONVEX_URL, { expectAuth: true, unsavedChangesWarning: false });
	const convexServer = new ConvexHttpClient(CONVEX_URL);
	// const convexQueryClient = new ConvexQueryClient(convex)

	// const queryClient: QueryClient = new QueryClient({
	//   defaultOptions: {
	//     queries: {
	//       queryKeyHashFn: convexQueryClient.hashFn(),
	//       queryFn: convexQueryClient.queryFn(),
	//     },
	//   },
	// })
	// convexQueryClient.connect(queryClient)

	// const router = routerWithQueryClient(
	//   createTanStackRouter({
	//     routeTree,
	//     defaultPreload: 'intent',
	//     defaultErrorComponent: DefaultCatchBoundary,
	//     defaultNotFoundComponent: () => <NotFound />,
	//     context: { queryClient, convexClient: convex, convexQueryClient },
	//     scrollRestoration: true,
	//     Wrap: ({ children }) => (
	//       <ConvexProvider client={convexQueryClient.convexClient}>
	//         {children}
	//       </ConvexProvider>
	//     ),
	//   }),
	//   queryClient,
	// )

	const router = createTanStackRouter({
		routeTree,
		context: { convex, convexServer },
		scrollRestoration: true,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
