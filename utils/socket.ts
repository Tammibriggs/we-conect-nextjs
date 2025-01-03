import { io } from "socket.io-client";

const isBrowser = typeof window !== "undefined";

export const socket = isBrowser ? io({ path: "/api/socket" }) : null;
