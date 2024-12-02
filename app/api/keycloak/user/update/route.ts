import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAdminToken } from "@/utils/keycloak";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const adminToken = await getAdminToken();

        // Validate required fields
        if (!body.userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const payload = {
            firstName: body.firstName,
            lastName: body.lastName,
            attributes: {
                image: body.image,
                street: body.street,
                locality: body.city,
                region: body.state,
                postal_code: body.zip,
                country: body.country,
            },
        };

        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users/${body.userId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );

        return NextResponse.json({ message: "User updated successfully", data: response.data }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating user in Keycloak:", error?.response?.data || error.message);

        const status = error?.response?.status || 500;
        const message = error?.response?.data?.error || "Failed to update user in Keycloak";

        return NextResponse.json({ error: message }, { status });
    }
}
