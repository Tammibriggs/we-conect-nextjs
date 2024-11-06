import User from "@/server/models/User";
import { connectDbWithoutHanlder } from "@/server/utils/mongodb";
import { authShema } from "@/server/utils/yupSchemas";
import CryptoJS from "crypto-js";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
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
          console.log(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      const { iat, jti, exp, ...others } = token;
      return {
        ...session,
        user: others,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
};

export { authOptions };
export default NextAuth(authOptions);
