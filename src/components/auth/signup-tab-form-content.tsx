"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signupAction, {
	type SignupFormState,
} from "@/server/actions/auth/signup/action";
import { signupFormSchema } from "@/server/actions/auth/signup/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function SignupTabFormContent() {
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem className="space-y-0">
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input placeholder="Peter Anteater" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="space-y-0">
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="name@email.com" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="space-y-0">
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{formState.error && (
					<p className="text-destructive">{formState.message}</p>
				)}
				<Button
					disabled={isPending}
					variant="outline"
					type="submit"
					className="mt-2 w-full"
				>
					Sign up
				</Button>
			</form>
		</Form>
	);
}
