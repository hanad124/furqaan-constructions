"use client";

import "./login.scss";

import { authenticate } from "../../utils/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Image from "next/image";

import logo from "../../public//assets/logo-light.svg";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  // create a form instance with useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // onSubmit callback function
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const user = await authenticate(data);
      // toast.success("Login successful");

      router.push("/dashboard");
    } catch (error) {
      form.setError("username", {
        type: "manual",
        message: "Username or password is incorrect",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login bg-white">
      <div className="login-container">
        <div className="login-cols flex justify-center items-center h-screen w-full">
          <div className="login-cols-2 bg-white w-full mx-3 md:max-0  px-7 py-10 md:w-[23rem] rounded-lg">
            <div className="flex items-center  gap-3">
              <Image
                src={logo}
                width={500}
                height={500}
                alt="logo"
                className="w-8"
              />
              <h1 className="text-2xl font-semibold text-[#27255F] uppercase">
                Furqan
              </h1>
            </div>

            <h2 className="text-left mt-[2rem]  text-[1.2rem] font-medium text-[#27255F]">
              Login to your account
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="form">
                <p className="email">Username</p>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[19rem]">
                      <FormControl>
                        <Input
                          type="text"
                          id="username"
                          placeholder="username name"
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="password">Password</p>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-[19rem]">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******* "
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <br />
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={loading}
                  className={`dark:text-white w-full mb-10
                c
                 ${
                   loading ? "bg-primary/60 cursor-not-allowed" : "bg-primary"
                 }`}
                >
                  <span>Submit</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
