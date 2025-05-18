import toast from "react-hot-toast";
import { api } from "./axios";
import { setCookie } from "cookies-next";

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    const { data } = await api.post(`/auth/token/refresh?refresh_token=${refreshToken}`);
    
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    setCookie("access_token", JSON.stringify(data.access_token));
    setCookie("refresh_token", JSON.stringify(data.refresh_token));
    toast.success("Token actualizado correcta y automaticamente");
    return data.access_token;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    return null;
  }
}
