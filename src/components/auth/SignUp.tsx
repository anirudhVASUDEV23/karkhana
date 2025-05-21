import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signUp, clearError } from '../../store/slices/authSlice';

interface SignUpProps {
  onToggleForm: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(signUp({ email, password })).unwrap();
      toast({
        title: 'Success',
        description: 'Account created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Error is handled in the auth slice
    }
  };

  if (error) {
    toast({
      title: 'Error',
      description: error,
      status: 'error',
      duration: 3000,
      isClosable: true,
      onCloseComplete: () => dispatch(clearError()),
    });
  }

  return (
    <Box 
      maxW="md" 
      mx="auto" 
      p={6} 
      borderWidth={1} 
      borderRadius="lg" 
      boxShadow="lg"
      bg="white"
    >
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Create Account</Heading>
        
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="blue" 
          width="full" 
          mt={4}
          isLoading={loading}
        >
          Sign Up
        </Button>
        
        <Text pt={2}>
          Already have an account?{' '}
          <Button 
            variant="link" 
            color="blue.500"
            onClick={onToggleForm}
          >
            Sign In
          </Button>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;