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
import { LogOut, User, LogIn, UserPlus} from "lucide-react";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

const mockAuthState = {
  isAuthenticated: false,
  user: null,
};

export function Header() {
  const router = useRouter();
  const [authState, setAuthState] = useState(mockAuthState);

  useEffect(() => {


    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken"); 

      if (!accessToken) {
        setAuthState({isAuthenticated: false, user: null});
        console.log("el uasuario no esta logeado")
        return;
      }

      try {
        const {data} = await api.get("/auth/users/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setAuthState({
          isAuthenticated: true,
          user: {
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
          },
        });
      } catch (error) {
        if(error.response && error.response.status === 401|| error.response.status === 403) {
          localStorage.removeItem("accessToken");
          setAuthState({isAuthenticated: false, user: null});
          toast.error("Sesión expirada. Por favor inicie sesión nuevamente.")
          router.push("/");
        }

      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken"); 

    if (!accessToken) {
      setAuthState({isAuthenticated: false, user: null});
      router.push("/");
      return;
    }
    try{

      await api.post("/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      )
      localStorage.removeItem("accessToken");
      setAuthState({isAuthenticated: false, user: null});
      router.push("/");
      toast.success("Sesión cerrada correctamente")
    }catch(error){
      console.error("Error logging out:", error);
      toast.error("Error al cerrar sesión");
      
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setAuthState({isAuthenticated: false, user: null});
        router.push("/");
      }
    }

  };
  
  const getInitials = (firstName, lastName) => {
    const first = firstName || "";
    const last = lastName || "";
    const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return initials || "NA";
  };
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="md:hidden">
          
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="text-xl font-bold md:text-left text-center"
          >
            <span className="hidden md:inline">Sistema de Gestión</span>
            <span className="md:hidden">SG</span>
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
            <>
            <div className="hidden md:flex gap-2" align="end">
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>

            <DropdownMenu>
               <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                        <Link href="/login">Iniciar Sesión</Link>

                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <Link href="/register">Registrarse</Link>

                    </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
