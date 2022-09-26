import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Button,
  Circle,
  Divider,
  HStack,
  Tab,
  TabList,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FriendListContext } from "../pages/Home";
import AddFriendModal from "./AddFriendModal";

const Friendsbar = () => {
  const { Fl } = useContext(FriendListContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(Fl)
  return (
    <>
      <VStack>
        <HStack paddingTop="1rem">
          <h1>Add Chatter</h1>
          <Button onClick={onOpen}>
            <SmallAddIcon />
          </Button>
        </HStack>
        <Divider pt="0.5rem" color="grey" />
        <VStack as={TabList}>
          {/* <HStack as={Tab}>
          <Circle
            bg="red.500"
            w="15px"
            h="15px"
          />
          <Text>chatteasssssssr</Text>
        </HStack>
        <HStack as={Tab} w="100%">
          <Circle
            bg="green"
            w="15px"
            h="15px"
          />
          <Text>chatteasssssssr</Text>
        </HStack> */}
          {Fl.map((f,i) => (
            <HStack as={Tab} key={i}>
              <Circle bg={"" + f.connected === "true" ? "green" : "red"} w="15px" h="15px" />
              <Text>{f.username}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose}/>
    </>
  );
};

export default Friendsbar;
