import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
    return (
        <Button
            asChild
            className="w-full font-semibold"
        >
            <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/google`}
            >
                Sign in with Google
            </Link>
        </Button>
    );
}
