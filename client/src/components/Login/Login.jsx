import {
  VStack,
  ButtonGroup,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AccountContext } from "../authComponents/AccountContext";
import Ax from "../utils/Axios";

const Login = () => {
  const {setAuth} = useContext(AccountContext)

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("username required")
        .min(6, "username too short")
        .max(28, "username too long"),
      password: Yup.string()
        .required("password required")
        .min(6, "Password too short")
        .max(28, "Password too long"),
    }),
    onSubmit: (values, actions) => {
      Ax.post("login", values).then((response) => {
        if (response) {
          setAuth({...response.data})
          navigate("/home")
        }
      })
      actions.resetForm()
    },
  });

  return (
    <VStack
      as="form"
      w={{ base: "90%", md: "500px" }}
      m="auto"
      justify="center"
      h="100vh"
      onSubmit={formik.handleSubmit}
    >
      <Heading>Log in</Heading>

      <FormControl isInvalid={formik.errors.username  && formik.touched.username}>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          placeholder="username"
          autoComplete="off"
          {...formik.getFieldProps("username")}
          size="lg"
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={formik.errors.password && formik.touched.password}>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          placeholder="password"
          autoComplete="off"
          type="password"
          {...formik.getFieldProps("password")}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>

      <ButtonGroup pt="1rem">
        <Button color="blue"  type="submit">Log in</Button>
        <Button onClick={() => navigate("/register")}>Register</Button>
      </ButtonGroup>
    </VStack>
  );
};

export default Login;
