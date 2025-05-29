"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
    return (
        <Button
            asChild
            className="w-full font-semibold"
        >
            <Link
                href="/auth/login/google"
                replace={false}
            >
                Sign in with Google
            </Link>
        </Button>
    );
}
