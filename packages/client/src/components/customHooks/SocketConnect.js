import { useContext, useEffect } from "react";

import socket from "../../socket";
import { AccountContext } from "../authComponents/AccountContext";

const SocketConnect = (setFl, setMessages) => {
  const { setAuth } = useContext(AccountContext);

  useEffect(() => {
    socket.connect();
    socket.on("chatters", (e) => {
      setFl(e);
    });
    socket.on("messages", (messages) => {
      // console.log(messages)
      setMessages(messages);
    });
    socket.on("message", message=> {
      setMessages(pM => [message, ...pM])
    })
    socket.on("connected", (status, username) => {
      setFl((prevChat) => {
        return [...prevChat].map((chatter) => {
          if (chatter.username === username) {
            chatter.connected = status;
          }
          return chatter;
        });
      });
    });
    socket.on("connect_error", () => {
      setAuth({ isLogged: false });
    });
    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("messages");
      socket.off("chatters");
      socket.off("message")
    };
  }, [setAuth, setFl, setMessages]);

  return <div>socketConnect</div>;
};

export default SocketConnect;
