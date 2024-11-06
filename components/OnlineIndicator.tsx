import { selectOnlineUsers } from "@/redux/chatSlice";
import { useSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";

function OnlineIndicator({ members }: { members: Array<string> }) {
  const onlineUsers = useSelector(selectOnlineUsers);
  const { data: sessionData } = useSession() as ClientSession;
  const userId = sessionData?.user?._id;

  const isOnline = () => {
    const memeber2Id = members?.find((id) => id !== userId);
    return !!onlineUsers[memeber2Id];
  };

  if (!isOnline()) return null;

  return (
    <span>
      <style jsx>{`
        span {
          position: absolute;
          padding: 5px;
          border: 1px solid white;
          background-color: #22c55e;
          border-radius: 50%;
          right: -1px;
          top: 3px;
        }
      `}</style>
    </span>
  );
}

export default OnlineIndicator;
