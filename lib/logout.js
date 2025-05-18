import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { deleteCookie } from "cookies-next";

export const handleLogoutSession = async (accessToken, router) => {
  if (!accessToken) {
    cleanupSession();
    router?.push("/");
    return;
  }

  try {
    if (typeof accessToken !== 'string' || accessToken.trim() === '') {
      throw new Error('Token inválido');
    }

    const response = await api.post(
      "/auth/logout",
      {}, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json" 
        },
        validateStatus: function (status) {
          return status < 500; 
        }
      }
    );

    if (response.status === 200 || response.status === 204) {
      toast.success("Sesión cerrada correctamente");
    }
  
  } catch (error) {
    console.error("Error en logout:", error);
    if (error.response?.status !== 401 && error.code !== 'ERR_NETWORK') {
      toast.error("Error al cerrar sesión");
    }
  } finally {
    cleanupSession();
    
    if (router && typeof router.push === 'function') {
      router.push("/");
    }
  }
};

export const cleanupSession = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  } catch (error) {
    console.error("Error al limpiar la sesión:", error);
  }
};