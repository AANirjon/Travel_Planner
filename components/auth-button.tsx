"use client";

import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-actions";

interface AuthButtonProps {
  isLoggedIn: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AuthButton({
  isLoggedIn,
  className,
  children,
}: AuthButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (isLoggedIn) {
      router.push("/trips");
    } else {
      await login();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)]"
      }
    >
      {children}
    </button>
  );
}
