import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthForm: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const bg = useColorModeValue("gray.50", "gray.800");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Box minH="100vh" bg={bg} py={12}>
      <Container maxW="lg">
        <Flex direction="column" align="center" mb={8}>
          <Heading as="h1" size="xl" mb={4} color="blue.500" fontWeight="bold">
            Cost Tracker
          </Heading>
          <Heading as="h2" size="md" color="gray.600" textAlign="center">
            {isSignIn
              ? "Sign in to manage your project costs"
              : "Create an account to get started"}
          </Heading>
        </Flex>

        {isSignIn ? (
          <SignIn onToggleForm={toggleForm} />
        ) : (
          <SignUp onToggleForm={toggleForm} />
        )}
      </Container>
    </Box>
  );
};

export default AuthForm;
