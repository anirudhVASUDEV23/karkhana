import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Text,
  Flex,
  useToast,
  TableContainer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteOtherCost } from '../../store/slices/otherCostsSlice';
import { OtherCost } from '../../types';
import OtherCostForm from './OtherCostForm';

const OtherCostList: React.FC = () => {
  const [currentCost, setCurrentCost] = useState<OtherCost | null>(null);
  const [costToDelete, setCostToDelete] = useState<string | null>(null);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { otherCosts, loading } = useAppSelector((state) => state.otherCosts);
  const toast = useToast();

  const handleAddCost = () => {
    setCurrentCost(null);
    onFormOpen();
  };

  const handleEditCost = (cost: OtherCost) => {
    setCurrentCost(cost);
    onFormOpen();
  };

  const handleDeleteClick = (id: string) => {
    setCostToDelete(id);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (costToDelete && user) {
      try {
        await dispatch(
          deleteOtherCost({
            userId: user.uid,
            otherCostId: costToDelete,
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Other cost deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete other cost',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onDeleteClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Other Costs
        </Text>
        <Button 
          leftIcon={<Plus size={18} />} 
          colorScheme="teal" 
          onClick={handleAddCost}
        >
          Add Other Cost
        </Button>
      </Flex>

      {otherCosts.length === 0 ? (
        <Box 
          p={6} 
          textAlign="center" 
          borderWidth={1} 
          borderRadius="md" 
          borderStyle="dashed"
          borderColor="gray.300"
          bg="gray.50"
        >
          <Text color="gray.500">
            No other costs added yet. Click the "Add Other Cost" button to add your first cost.
          </Text>
        </Box>
      ) : (
        <TableContainer borderWidth={1} borderRadius="md">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Description</Th>
                <Th isNumeric>Amount</Th>
                <Th width="100px" textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {otherCosts.map((cost) => (
                <Tr key={cost.id}>
                  <Td>{cost.description}</Td>
                  <Td isNumeric>{formatCurrency(cost.amount)}</Td>
                  <Td>
                    <Flex justifyContent="center" gap={2}>
                      <IconButton
                        aria-label="Edit cost"
                        icon={<Edit2 size={18} />}
                        size="sm"
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => handleEditCost(cost)}
                      />
                      <IconButton
                        aria-label="Delete cost"
                        icon={<Trash2 size={18} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(cost.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <OtherCostForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        currentCost={currentCost}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Other Cost
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this cost? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={confirmDelete} 
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default OtherCostList;