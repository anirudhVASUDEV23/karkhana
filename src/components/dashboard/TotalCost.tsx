import React, { useMemo } from 'react';
import {
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAppSelector } from '../../store/hooks';

const TotalCost: React.FC = () => {
  const { items } = useAppSelector((state) => state.items);
  const { otherCosts } = useAppSelector((state) => state.otherCosts);
  
  const totalItemsCost = useMemo(() => {
    return items.reduce((sum, item) => sum + item.cost, 0);
  }, [items]);
  
  const totalOtherCost = useMemo(() => {
    return otherCosts.reduce((sum, cost) => sum + cost.amount, 0);
  }, [otherCosts]);
  
  const grandTotal = totalItemsCost + totalOtherCost;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box 
      mb={8} 
      p={6} 
      borderRadius="lg" 
      bg={bgColor}
      boxShadow="md"
      borderWidth={1}
      borderColor={borderColor}
    >
      <Text 
        fontSize="lg" 
        fontWeight="bold" 
        mb={4}
        color="gray.700"
      >
        Project Cost Summary
      </Text>

      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        gap={6}
        justify="space-between"
      >
        <Stat>
          <StatLabel color="gray.500">Items Total</StatLabel>
          <StatNumber fontSize="2xl" color="blue.500">
            {formatCurrency(totalItemsCost)}
          </StatNumber>
          <StatHelpText>
            {items.length} item{items.length === 1 ? '' : 's'}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="gray.500">Other Costs Total</StatLabel>
          <StatNumber fontSize="2xl" color="teal.500">
            {formatCurrency(totalOtherCost)}
          </StatNumber>
          <StatHelpText>
            {otherCosts.length} item{otherCosts.length === 1 ? '' : 's'}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="gray.500">Grand Total</StatLabel>
          <StatNumber 
            fontSize="3xl" 
            fontWeight="bold" 
            color="orange.500"
          >
            {formatCurrency(grandTotal)}
          </StatNumber>
          <StatHelpText>
            {items.length + otherCosts.length} total entries
          </StatHelpText>
        </Stat>
      </Flex>
    </Box>
  );
};

export default TotalCost;