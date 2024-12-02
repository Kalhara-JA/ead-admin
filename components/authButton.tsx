"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 border rounded-full"
          >
            <User className="h-4 w-4 text-white dark:text-white" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-[#03071E] text-white border border-gray-700"
        >
          <DropdownMenuItem className="hover:bg-[#370617">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-gray-400">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="hover:bg-[#370617]"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" onClick={() => signIn()}>
      Sign in
    </Button>
  );
}
