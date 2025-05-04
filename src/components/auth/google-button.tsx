import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
    return (
        <Button
            asChild
            className="w-full font-semibold"
        >
            <Link href="/login/google">Sign in with Google</Link>
        </Button>
    );
}
