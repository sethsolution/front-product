import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { deleteCookie } from "cookies-next";

export const handleLogoutSession = async (accessToken, router) => {
  localStorage.clear();
  if (!accessToken) {
    router.push("/");
    return;
  }
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    toast.success("Sesión cerrada correctamente");
    router.push("/");
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("Error al cerrar sesión");
    if (error.response && error.response.status === 401) {
      router.push("/");
    }
  }
};
