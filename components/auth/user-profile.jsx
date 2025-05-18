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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

export function UserProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "usuario@ejemplo.com",
    first_name: "",
    last_name: "",
    is_verified: false,
    //created_at: "2023-01-15T10:30:00Z",
    avatar: "",
    // tasks_completed: 12,
    // tasks_pending: 5,
    bio: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {

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
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
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
              {/* <TabsTrigger value="stats">Estadísticas</TabsTrigger> */}
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
            {/* TODO: Agregar un apartado de estadisticas del usuario */}
            {/* <TabsContent value="stats" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Tareas completadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {user.tasks_completed}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tareas pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {user.tasks_pending}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
