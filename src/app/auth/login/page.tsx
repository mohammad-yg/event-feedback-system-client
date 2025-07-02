"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z.string().min(3).max(256),
  password: z.string().min(3).max(256),
});

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "string",
      password: "string",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    }).then((result) => {
      if (result?.error) {
        console.error("Login failed:", result);
      } else {
        router.push("/dashboard");
      }
      setLoading(false);
    });
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">Login Form</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 px-2 space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="enter your email" {...field} />
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
                  <Input placeholder="enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
