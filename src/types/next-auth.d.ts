/**
 * next-auth.d.ts
 * 
 * NextAuth 타입 확장 - session.user.id 추가
 */

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
