import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext } from "react";
import socket from "../../socket";
import { FriendListContext } from "../pages/Home";

const AddFriendModal = ({ isOpen, onClose }) => {
  const { setFl } = useContext(FriendListContext);
  const formik = useFormik({
    initialValues: { nickname: "" },

    onSubmit: (values) => {
      socket.emit("add_chatter", values.nickname, ({ error, response, addedChatter }) => {
        console.log(response);
        if (response) {
          onClose();
          console.log("no error");
          console.log(addedChatter);
          setFl((c) => [addedChatter, ...c]);
          return;
        } else {
          console.log(error);
        }
      });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add friend</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isInvalid={formik.errors.nickname && formik.touched}>
            <FormLabel>Friend id</FormLabel>
            <Input
              name="nickname"
              placeholder="nickname"
              autoComplete="off"
              {...formik.getFieldProps("nickname")}
            />
            <FormErrorMessage>{formik.error}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
