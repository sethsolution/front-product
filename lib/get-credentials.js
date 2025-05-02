"use server"

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const getCredentials = async () => {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value ?? "";
    
    if (!access_token) {
      return { user_name: null, user_email: null };
    }
    
    const decoded = jwtDecode(access_token);
    
    return {
      user_name: decoded.sub,
      user_email: decoded.email,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { user_name: null, user_email: null };
  }
};