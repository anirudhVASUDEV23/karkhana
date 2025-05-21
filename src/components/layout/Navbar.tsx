import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  useColorModeValue,
  Container,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react';
import { LogOut, BarChart2, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { clearItems } from '../../store/slices/itemsSlice';
import { clearOtherCosts } from '../../store/slices/otherCostsSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearItems());
      dispatch(clearOtherCosts());
      toast({
        title: 'Success',
        description: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      py={4} 
      bg={useColorModeValue('white', 'gray.900')} 
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex align="center">
          <Heading 
            size="md" 
            color={useColorModeValue('blue.600', 'blue.300')}
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            Project Cost Tracker
          </Heading>
          
          <Spacer />
          
          {user && (
            <Flex align="center" gap={4}>
              <ButtonGroup variant="ghost" spacing={2}>
                <Button
                  leftIcon={<Home size={18} />}
                  onClick={() => navigate('/')}
                  colorScheme={location.pathname === '/' ? 'blue' : 'gray'}
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  leftIcon={<BarChart2 size={18} />}
                  onClick={() => navigate('/charts')}
                  colorScheme={location.pathname === '/charts' ? 'blue' : 'gray'}
                  size="sm"
                >
                  Charts
                </Button>
              </ButtonGroup>
              
              <Box fontSize="sm" color="gray.600">
                {user.email}
              </Box>
              
              <Button 
                leftIcon={<LogOut size={18} />} 
                colorScheme="red" 
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Flex>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;