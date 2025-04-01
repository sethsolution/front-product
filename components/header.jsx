"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

const mockAuthState = {
  isAuthenticated: false,
  user: null,
};

export function Header() {
  const router = useRouter();
  const [authState, setAuthState] = useState(mockAuthState);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("accessToken");

    const fetchUserData = async () => {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/auth/users/me/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${isLoggedIn}`,
          },
        });

        const data = await response.json();

        setAuthState({
          isAuthenticated: true,
          user: {
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken"); 

    if (!accessToken) {
      return;
    }

    const response = await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: "",
    });

    const data = await response.json();

    console.log(data.msg);
    localStorage.clear();

    setIsAuthenticated(false);

    // Redirigir a la página de inicio
    router.push("/");
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName || "";
    const last = lastName || "";
    const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return initials || "NA"; // Fallback si ambos están vacíos
  };
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            Sistema de Gestión
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {authState.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={authState.user.avatar}
                      alt={authState.user.username}
                    />
                    <AvatarFallback>
                      {authState.user
                        ? getInitials(
                            authState.user.first_name,
                            authState.user.last_name
                          )
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">
                      {authState.user.first_name} {authState.user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{authState.user.username}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
