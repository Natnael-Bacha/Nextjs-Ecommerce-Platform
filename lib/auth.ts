import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { authClient } from "./auth-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [
    "https://nextjs-ecommerce-platform.vercel.app",
    "https://*.vercel.app",
  ],
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        input: true,
      },

      middleName: {
        type: "string",
        input: true,
      },

      lastName: {
        type: "string",
        input: true,
      },
      email: {
        type: "string",
        input: true,
      },
      phoneNumber: {
        type: "string",
        input: true,
      },
      role: {
        type: "string",
        input: false,
      },
    },
  },
});
