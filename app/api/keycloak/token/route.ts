import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axiosInstance";

export async function POST(req: NextRequest) {
     try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/realms/store/protocol/openid-connect/token`,
            new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET!,
                grant_type: "password",
                username: process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_USERNAME!,
                password: process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_PASSWORD!,
                scope: "openid roles profile",
            }),
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Keycloak admin token:", error);
        throw new Error("Unable to fetch Keycloak admin token");
    }
  try {
    const response = await axios.post(
      "/realms/master/protocol/openid-connect/token",
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "client_credentials",
      })
    );

    return NextResponse.json({ token: response.data.access_token });
  } catch (error) {
    console.error("Error fetching admin token:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin token" },
      { status: 500 }
    );
  }
}
