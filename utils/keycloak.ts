//utils/keycloak.ts

import axios from "axios";

export const getAdminToken = async () => {
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
};

export const registerUserInKeycloak = async (user: any, adminToken: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users`,
            {
                username: user.email,

                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: true,
                credentials: [
                    {
                        type: "password",
                        value: user.password,
                        temporary: false,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error registering user in Keycloak:", error);
        throw new Error("Unable to register user in Keycloak");
    }
};

export const updateUserInKeycloak = async (userId: string, userData: any, adminToken: string) => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users/${userId}`,
            {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                attributes: {
                    image: userData.image,
                    street: userData.street,
                    locality: userData.city,
                    region: userData.state,
                    postal_code: userData.zip,
                    country: userData.country,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user in Keycloak:", error);
        throw new Error("Unable to update user in Keycloak");
    }
};