import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import type { ErrorContext } from "better-auth/react";
import { type FormEvent, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getCookieName } from "@/lib/auth-server-utils";

// SERVER **********************************************************************************************************************************
const ensureUnauthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
	const sessionCookieName = await getCookieName();
	const token = getCookie(sessionCookieName);
	if (token) redirect({ to: "/admin" });
});

// ROUTE ***********************************************************************************************************************************
export const Route = createFileRoute("/signin")({
	beforeLoad: async () => await ensureUnauthenticatedFn(),
	component: SigninPage,
});

// ROOT ************************************************************************************************************************************
function SigninPage() {
	const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			formData.set("flow", flow);

			const opts = { onError: (ctx: ErrorContext) => setError(ctx.error.message), onSuccess: () => navigate({ to: "/admin" }) };
			const data = { email: formData.get("email") as string, password: formData.get("password") as string };
			await (flow === "signIn"
				? authClient.signIn.email(data, opts)
				: authClient.signUp.email({ ...data, name: "Gregory Bouteiller" }, opts));
		},
		[flow, navigate],
	);

	return (
		<div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
			<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
				<Input type="email" name="email" placeholder="Email" />
				<Input type="password" name="password" placeholder="Password" />
				<Button type="submit" className="cursor-pointer">
					{flow === "signIn" ? "Sign in" : "Sign up"}
				</Button>
				<div className="flex gap-2">
					<span>{flow === "signIn" ? "Don't have an account?" : "Already have an account?"}</span>
					<Button variant="link" onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}>
						{flow === "signIn" ? "Sign up instead" : "Sign in instead"}
					</Button>
				</div>
				{error && (
					<div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
						<p className="text-foreground font-mono text-xs">Error signing in: {error}</p>
					</div>
				)}
			</form>
		</div>
	);
}
