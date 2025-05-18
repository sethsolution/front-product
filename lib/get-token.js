import { setCookie } from "cookies-next";
import { api } from "./axios";

export const getToken = async (username, password) => {
    try {
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("grant_type", "password");
        urlEncodedData.append("username", username);
        urlEncodedData.append("password", password);
        urlEncodedData.append("scope", "");
        urlEncodedData.append("client_id", "string");
        urlEncodedData.append("client_secret", "string");

        const { data } = await api.post("/auth/token", urlEncodedData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (data.detail) {
            throw new Error(data.detail)
        }

        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        setCookie("access_token", JSON.stringify(data.access_token))
        setCookie("refresh_token", JSON.stringify(data.refresh_token))

        return { success: true };
    } catch (error) {
        console.error('Error en getToken:', error.message);
        return { success: false, error: error.message };
    }
};