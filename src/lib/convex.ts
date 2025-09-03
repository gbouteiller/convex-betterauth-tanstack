import type { ConvexHttpClient } from "convex/browser";
import type { Preloaded } from "convex/react";
import { type FunctionReference, getFunctionName } from "convex/server";
import { convexToJson } from "convex/values";

export async function preloadQuery<Q extends FunctionReference<"query">>(
	convex: ConvexHttpClient,
	query: Q,
	args: Q["_args"] = {},
): Promise<Preloaded<Q>> {
	const value = await convex.query(query, args);
	const preloaded = {
		_name: getFunctionName(query),
		_argsJSON: convexToJson(args[0] ?? {}),
		_valueJSON: convexToJson(value),
	};
	return preloaded as any;
}
