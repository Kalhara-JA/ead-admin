import { AuthOptions, TokenSet, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

function requestRefreshOfAccessToken(token: JWT) {
  return fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken! as string,
    }),
    method: "POST",
    cache: "no-store",
  });
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
    }),

    CredentialsProvider({
      name: "Keycloak",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
            client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
            grant_type: "password",
            username: credentials?.email ?? '',
            password: credentials?.password ?? '',
            scope: "openid profile email address",
          }),
          method: "POST",
          cache: "no-store",
        });

        const tokens: TokenSet = await response.json();

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const decoded: any = jwtDecode(tokens.access_token as string);

        return {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          image: decoded.image,
          roles: decoded.resource_access[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!].roles,
          address: decoded.address,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        } as User;
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },

  callbacks: {
    async jwt({ token, account, user }) {

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || "";
        token.roles = user.roles || [];
        token.address = user.address;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      if (Date.now() < token.expiresAt! * 1000 - 60 * 1000) {
        return token;
      } else {
        try {
          const response = await requestRefreshOfAccessToken(token);

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          const updatedToken: JWT = {
            ...token,
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          };

          const newDecoded: any = jwtDecode(updatedToken.accessToken!);
          if (newDecoded.resource_access) {
            const newResourceRoles = newDecoded.resource_access[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!].roles;

            updatedToken.roles = newResourceRoles;
          }

          updatedToken.image = newDecoded.image;
          updatedToken.address = newDecoded.address;
          
          return updatedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token, user }) {
      

      session.accessToken = token.accessToken;
      session.roles = token.roles as string[];
      session.error = token.error;
      session.user = {
        ...session.user,
        id: token.id,
        image: token.image,
        address: token.address,
      };

      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

