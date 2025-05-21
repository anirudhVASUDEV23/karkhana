import React, { useEffect } from 'react';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUser } from './store/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Charts from './components/charts/Charts';
import AuthForm from './components/auth/AuthForm';

const theme = extendTheme({
  colors: {
    blue: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3B82F6',
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
    teal: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#0BC5EA',
      600: '#319795',
      700: '#2C7A7B',
      800: '#285E61',
      900: '#234E52',
    },
    orange: {
      50: '#FFFAF0',
      100: '#FEEBCB',
      200: '#FBD38D',
      300: '#F6AD55',
      400: '#ED8936',
      500: '#DD6B20',
      600: '#C05621',
      700: '#9C4221',
      800: '#7B341E',
      900: '#652B19',
    },
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderBottom: '1px',
            borderColor: 'gray.200',
            padding: '1rem',
            fontWeight: 'semibold',
            textTransform: 'none',
            letterSpacing: 'normal',
          },
          td: {
            borderBottom: '1px',
            borderColor: 'gray.100',
            padding: '1rem',
          },
        },
      },
    },
  },
});

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setUser(firebaseUser));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/charts" 
              element={user ? <Charts /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/auth" 
              element={!user ? <AuthForm /> : <Navigate to="/" />} 
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;