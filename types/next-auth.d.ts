import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    /**
     * Extending the JWT interface to include custom fields.
     */
    interface JWT {
        id: string; // User IDƒ
        idToken?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number; // Timestamp in seconds
        error?: string; // Error message if any issues occur with token refreshing
        roles?: string[]; // Roles assigned to the user
        image?: string; // User profile image URL
        address?: {
            street_address?: string;
            locality?: string;
            region?: string;
            postal_code?: string;
            country?: string;
        }; // User address details
    }
}

declare module "next-auth" {
    /**
     * Extending the Session interface to include custom fields.
     */
    interface Session {
        accessToken?: string; // Access token for API requests
        error?: string; // Error message if any issues occur with session
        roles: string[]; // User roles
        user?: {
            id: string; // User ID
            name?: string; // User's full name
            email?: string; // User's email address
            image?: string; // User's profile image URL
            address?: {
                street_address?: string;
                locality?: string;
                region?: string;
                postal_code?: string;
                country?: string;
            }; // User address details
        };
    }
}

declare module "next-auth" {
    interface User {
        id: string;
        roles?: string[];
        address?: {
            street_address?: string;
            locality?: string;
            region?: string;
            postal_code?: string;
            country?: string;
        };
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        image?: string;
    }
}
