import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import KeycloakProvider from "next-auth/providers/keycloak"
import { jwtDecode } from "jwt-decode";


function requestRefreshOfAccessToken(token: JWT) {
  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID as string,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken! as string,
    }),
    method: "POST",
    cache: "no-store"
  });
}


export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 30
  },
  callbacks: {
    async jwt({ token, account }) {

      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        if (account.id_token) {
          const decoded = jwtDecode(account.id_token as string);
        }
      }

      if (token.accessToken) {
        const decoded: any = jwtDecode(token.accessToken as string);
        let resourceRoles: string[] = [];

        if (decoded.resource_access[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!]) {
          resourceRoles = decoded.resource_access[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!].roles;
        }
        token.roles = resourceRoles;

      }

      if (Date.now() < (token.expiresAt! * 1000 - 60 * 1000)) {
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

          const newDecoded: any = jwtDecode(updatedToken.accessToken as string);
          if (newDecoded.resource_access) {
            const newResourceRoles = Object.values(newDecoded.resource_access)
              .flatMap((resource: any) => resource.roles)
              .filter((role, index, self) => self.indexOf(role) === index); // Remove duplicates

            updatedToken.roles = newResourceRoles;
          }

          return updatedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.roles = token.roles as string[];
      session.error = token.error;
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }