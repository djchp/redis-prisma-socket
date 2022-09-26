import { Button, HStack, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext } from "react";
import socket from "../../socket";
import { messagesContext } from "../pages/Home";

const ChatInput = ({ userId }) => {

  const {setMessages} = useContext(messagesContext)

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: (values, actions) => {
      setMessages((pM) => [message, ...pM])
      // console.log(values.message)
      const message = { to: userId, from: null, body: values.message };
      socket.emit("message", message);
      actions.resetForm();
    },
  });
  return (
    <HStack display="flex" w="100%">
      <Input
        name="message"
        autoComplete="off"
        placeholder="enter message"
        {...formik.getFieldProps("message")}
      />

      <Button type="submit" onClick={formik.handleSubmit}>
        Send message
      </Button>
    </HStack>
  );
};

export default ChatInput;
