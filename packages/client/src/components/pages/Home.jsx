import { Box, Flex, Tabs } from "@chakra-ui/react";
import { createContext, useState } from "react";
import SocketConnect from "../customHooks/SocketConnect";

import Chat from "../homeComponents/Chat";
import Friendsbar from "../homeComponents/Friendsbar";

export const FriendListContext = createContext();
export const messagesContext = createContext();

const Home = () => {
  const [Fl, setFl] = useState([]);
  const [messages, setMessages] = useState([]);
  const [marker, setMarker] = useState(0);
  SocketConnect(setFl, setMessages);
  return (
    <FriendListContext.Provider value={{ Fl, setFl }}>
      <Flex h="100vh" as={Tabs} onChange={(index) => setMarker(index)}>
        <Box flex="2">
          <Friendsbar />
        </Box>
        <Box flex="7" borderLeft="0.5px solid grey" maxH="100vh">
          <messagesContext.Provider value={{ messages, setMessages }}>
            <Chat userId={Fl[marker]?.userId} />
          </messagesContext.Provider>
        </Box>
      </Flex>
    </FriendListContext.Provider>
  );
};

export default Home;
