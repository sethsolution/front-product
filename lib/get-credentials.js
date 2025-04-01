import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const getCredentials = async () => {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value ?? "";
  const decoded = jwtDecode(JSON.parse(access_token));
  return {
    user_name: decoded.sub,
    user_email: decoded.email,
  };
};
