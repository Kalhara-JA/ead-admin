import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAdminToken } from "@/utils/keycloak";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const adminToken = await getAdminToken();

        const payload = {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username || body.email,
            enabled: true,
            credentials: [
                {
                    type: "password",
                    value: body.password,
                    temporary: false,
                },
            ],
            attributes: {
                image: body.image,
                street: body.street,
                locality: body.locality,
                region: body.region,
                postal_code: body.postal_code,
                country: body.country,
            },
        };
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error creating user in Keycloak:", error);
        return NextResponse.json(
            { error: "Failed to create user in Keycloak" },
            { status: 500 }
        );
    }
}
