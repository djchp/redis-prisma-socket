import { TabPanel, TabPanels, Text, VStack } from "@chakra-ui/react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { FriendListContext, messagesContext } from "../pages/Home";
import ChatInput from "./ChatInput";

const Chat = ({userId}) => {
  const { Fl } = useContext(FriendListContext);
  const { messages } = useContext(messagesContext);
  const divToScroll = useRef(null)


  useEffect(() => {
    divToScroll.current?.scrollIntoView()
  })
  


  // console.log(messages)
  return Fl?.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {Fl.map((chatter) => (
          <VStack
            flexDir="column-reverse"
            as={TabPanel}
            key={`chat:${chatter.username}`}
            w="100%"
          >
            <div ref={divToScroll}/>
            {messages.filter(message =>
                  message.to === chatter.userId ||
                  message.from === chatter.userId
              )
              .map((messager,i) => (
                <Text key={`message:${chatter.username}${i}`}
                maxW="50%"
                  m={messager.to === chatter.userId ? "1rem 0 0 auto !important" : "1rem auto 0 0 !important"}
                  bg={messager.to === chatter.userId ? "blue.200" : "gray"}
                  color="green.900"
                  borderRadius="20px"
                  p="0.2rem 1rem"
                >{messager.body}</Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatInput userId={userId}/>
    </VStack>
  ) : (
    <VStack h="100%" justify="end">
      <TabPanels>
        <Text>Find friends lol</Text>
      </TabPanels>
    </VStack>
  );
};

export default Chat;
