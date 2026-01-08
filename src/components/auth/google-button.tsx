import { Button } from "@/components/ui/button";

export function GoogleButton() {
	return (
		<form action="/auth/login/google" method="GET" className="w-full">
			<Button type="submit" className="w-full font-semibold">
				Sign in with Google
			</Button>
		</form>
	);
}
