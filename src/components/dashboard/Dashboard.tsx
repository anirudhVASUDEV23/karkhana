import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  useToast,
  Skeleton,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchItems } from '../../store/slices/itemsSlice';
import { fetchOtherCosts } from '../../store/slices/otherCostsSlice';
import TotalCost from './TotalCost';
import ItemList from '../items/ItemList';
import OtherCostList from '../otherCosts/OtherCostList';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading: itemsLoading, error: itemsError } = useAppSelector((state) => state.items);
  const { loading: costsLoading, error: costsError } = useAppSelector((state) => state.otherCosts);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (itemsError) {
      toast({
        title: 'Error',
        description: itemsError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
    if (costsError) {
      toast({
        title: 'Error',
        description: costsError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [itemsError, costsError, toast]);

  const isLoading = itemsLoading || costsLoading;

  return (
    <Box py={6} bg="gray.50" minH="calc(100vh - 64px)">
      <Container maxW="container.xl">
        <Skeleton isLoaded={!isLoading} fadeDuration={1}>
          <TotalCost />
        </Skeleton>

        <Grid 
          templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} 
          gap={6}
        >
          <GridItem>
            <Skeleton isLoaded={!itemsLoading} fadeDuration={1}>
              <Box 
                bg="white" 
                p={6} 
                borderRadius="lg" 
                boxShadow="md"
                borderWidth={1}
                borderColor="gray.200"
                height="100%"
              >
                <ItemList />
              </Box>
            </Skeleton>
          </GridItem>
          
          <GridItem>
            <Skeleton isLoaded={!costsLoading} fadeDuration={1}>
              <Box 
                bg="white" 
                p={6} 
                borderRadius="lg" 
                boxShadow="md"
                borderWidth={1}
                borderColor="gray.200"
                height="100%"
              >
                <OtherCostList />
              </Box>
            </Skeleton>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;