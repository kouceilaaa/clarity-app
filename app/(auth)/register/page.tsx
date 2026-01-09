import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up - ClarityWeb",
  description: "Create your ClarityWeb account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
