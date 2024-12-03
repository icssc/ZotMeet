import { useState } from "react";
import signupAction, {
    SignupFormState,
} from "@/app/actions/auth/signup/action";
import { signupFormSchema } from "@/app/actions/auth/signup/schema";
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

export default function SignupTabContent() {
    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",
            password: "",
            displayName: "",
        },
    });

    const [formState, setFormState] = useState<SignupFormState>({
        message: "",
        error: false,
    });

    const onSubmit = async (data: z.infer<typeof signupFormSchema>) => {
        const response = await signupAction(data);

        setFormState(response);
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle className="text-2xl">Sign up</DialogTitle>
                <DialogDescription>
                    Enter your information below to sign up for an account
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4"
                >
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Peter Anteater"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@email.com"
                                        type="email"
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
                        Sign up
                    </Button>
                </form>
            </Form>
            {formState.error && <p>{formState.message}</p>}
        </div>
    );
}
