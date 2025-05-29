import { Button } from "@/components/ui/button";

export function GoogleButton() {
    return (
        <Button
            asChild
            className="w-full font-semibold"
        >
            <a href="/auth/login/google">Sign in with Google</a>
        </Button>
    );
}
