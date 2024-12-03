import { useState } from "react";
import loginAction, { LoginFormState } from "@/app/actions/auth/login/action";
import { loginFormSchema } from "@/app/actions/auth/login/schema";
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginTabContent() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [formState, setFormState] = useState<LoginFormState>({
        message: "",
        error: false,
    });

    const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
        const response = await loginAction(data);

        setFormState(response);
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle className="text-2xl">Login</DialogTitle>
                <DialogDescription>
                    Enter your email below to login to your account
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@email.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="mt-4 w-full"
                    >
                        Log in
                    </Button>
                </form>
            </Form>
            {formState.error && <p>{formState.message}</p>}
        </div>
    );
}
