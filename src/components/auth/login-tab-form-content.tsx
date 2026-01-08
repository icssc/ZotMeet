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
import loginAction, {
	type LoginFormState,
} from "@/server/actions/auth/login/action";
import { loginFormSchema } from "@/server/actions/auth/login/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function LoginTabFormContent() {
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="space-y-0">
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="name@email.com" {...field} />
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
					Log in
				</Button>
			</form>
		</Form>
	);
}
