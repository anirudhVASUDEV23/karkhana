import React from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#0BC5EA', '#ED8936', '#48BB78', '#9F7AEA'];

const Charts: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.items);
  const { otherCosts } = useAppSelector((state) => state.otherCosts);

  const itemsData = items.map(item => ({
    name: item.name,
    value: item.cost
  }));

  const costsData = otherCosts.map(cost => ({
    name: cost.description,
    value: cost.amount
  }));

  const combinedData = [
    {
      name: 'Items',
      total: items.reduce((sum, item) => sum + item.cost, 0)
    },
    {
      name: 'Other Costs',
      total: otherCosts.reduce((sum, cost) => sum + cost.amount, 0)
    }
  ];

  return (
    <Box py={6}>
      <Container maxW="container.xl">
        <Button
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/')}
          mb={6}
          variant="ghost"
        >
          Back to Dashboard
        </Button>

        <VStack spacing={8} align="stretch">
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" mb={4}>Cost Distribution</Heading>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...itemsData, ...costsData]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={(entry) => `${entry.name}: $${entry.value}`}
                  >
                    {[...itemsData, ...costsData].map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" mb={4}>Total Costs Comparison</Heading>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={combinedData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    fill="#3B82F6" 
                    name="Total Amount" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Charts;