import { setCookie } from "cookies-next";

export const getToken = async (username, password) => {
    try {
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("grant_type", "password");
        urlEncodedData.append("username", username);
        urlEncodedData.append("password", password);
        urlEncodedData.append("scope", "");
        urlEncodedData.append("client_id", "string");
        urlEncodedData.append("client_secret", "string");

        const resp = await fetch("http://localhost:8000/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: urlEncodedData.toString(),
        });

        const data = await resp.json();

        if (data.detail) {
            throw new Error(data.detail)
        }

        // Almacenar token (ejemplo con localStorage)
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        setCookie("access_token", JSON.stringify(data.access_token))
        setCookie("refresh_token", JSON.stringify(data.refresh_token))

        return { success: true };
    } catch (error) {
        console.log('Error en getToken:', error.message);
        return { success: false, error: error.message };
    }
};