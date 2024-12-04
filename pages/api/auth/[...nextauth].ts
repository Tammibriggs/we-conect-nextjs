import User from "@/server/models/User";
import { checkUsername } from "@/server/utils";
import { connectDbWithoutHanlder } from "@/server/utils/mongodb";
import { authShema } from "@/server/utils/yupSchemas";
import CryptoJS from "crypto-js";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
        flow: { label: "flow", type: "text" }, // signUp | signIn
      },
      async authorize(credentials, req) {
        try {
          await connectDbWithoutHanlder();
          const { username, password, flow } = credentials;

          await authShema.validate({ username, password });
          const user = await User.findOne({ username });

          if (flow === "signUp") {
            if (!user) {
              const encryptedPass = CryptoJS.AES.encrypt(
                password,
                process.env.PASS_ENC_SECT
              ).toString();

              const user = await User.create({
                username,
                password: encryptedPass,
              });

              const { password: userPassword, ...others } = user._doc;
              return others;
            }
          } else {
            const decryptedBytes = CryptoJS.AES.decrypt(
              user.password,
              process.env.PASS_ENC_SECT
            );
            const decryptedPassword = decryptedBytes.toString(
              CryptoJS.enc.Utf8
            );

            if (decryptedPassword !== password) {
              return null;
            }

            const { password: userPassword, ...others } = user._doc;
            // generated jwt token login user
            return others;
          }

          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const { name, image, id } = user;
          await connectDbWithoutHanlder();
          const userDoc = await User.findOne({ providerId: id });

          if (!userDoc) {
            let username = name.split(" ")[0]
            const result = await checkUsername(username)
            if(result.exists) username = result.suggestedUsername

            await User.create({
              username,
              providerId: id,
              profilePicture: {
                url: image,
              },
              provider: account.provider,
            });
          }
        }
        return true;
      } catch (err) {
        return `/login?error=Unable to signIn`;
      }
    },
    async jwt({ token, user, account }) {
      let updatedUser = { ...user };

      if (account?.provider === "google") {
        updatedUser = (await User.findOne({ providerId: user.id }))._doc;
      }

      return { ...token, ...updatedUser };
    },
    async session({ session, token }) {
      const { iat, jti, exp, ...others } = token;
      return {
        ...session,
        user: others,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

export { authOptions };
export default NextAuth(authOptions);
