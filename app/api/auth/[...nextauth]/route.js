// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { db } from "@/lib/firebaseConfig"; // Adjust the path if necessary
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const options = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const userDocRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new document
        await setDoc(userDocRef, {
          walletAddress: user.id,
          totalPoints: 0,
          currentRank: 0,
          referrals: 0,
          questsCompleted: 0,
          nftsCollected: 0,
          twitterConnected: true,
        });
      } else {
        const userData = userDoc.data();
        if (!userData.twitterConnected) {
          await updateDoc(userDocRef, {
            twitterConnected: true,
          });
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      // Include user ID and other necessary info in the session
      session.user.id = token.id;
      session.user.walletAddress = token.walletAddress;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.id = user.id;
        token.walletAddress = user.id; // Assuming user ID is the wallet address
      }
      return token;
    },
  },
};

export async function GET(request, response) {
  return NextAuth(options)(request, response);
}

export async function POST(request, response) {
  return NextAuth(options)(request, response);
}
