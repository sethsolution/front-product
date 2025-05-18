"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthRequiredModal } from "./auth-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export function UserProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "usuario@ejemplo.com",
    first_name: "",
    last_name: "",
    is_verified: false,
    avatar: "",
    bio: "",
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentReturnPath, setCurrentReturnPath] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        const currentPath = window.location.pathname;
        setIsAuthModalOpen(true);
        setCurrentReturnPath(currentPath);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data: userData } = await api.get("/auth/users/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser((prev) => ({
          ...prev,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
        }));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
        if (error.response?.status === 401) {
          setIsAuthModalOpen(true);
        } else {
          toast.error("No se pudo cargar la información del usuario");
        }
      }
    };

    fetchUserData();
  }, [router]);

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : "";
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-4xl flex justify-center">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {isAuthModalOpen && (
        <AuthRequiredModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          returnPath={currentReturnPath}
        />
      )}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(user.first_name, user.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl flex items-center space-x-1">
                  <span>{user.first_name} {user.last_name}</span>
                  {user.is_verified && <CheckCircleIcon className="h-5 w-5 text-blue-500" />}
                </CardTitle>

                <CardDescription className="text-base">
                  @{user.username}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-6 pt-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nombre completo</p>
                    <p>
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Correo electrónico</p>
                    <p>{user.email}</p>
                  </div>
                </div>
                
                {user.bio && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Biografía</p>
                    <p className="mt-1 text-muted-foreground">{user.bio}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}