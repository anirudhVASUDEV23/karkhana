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
import { deleteItem } from '../../store/slices/itemsSlice';
import { Item } from '../../types';
import ItemForm from './ItemForm';

const ItemList: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading } = useAppSelector((state) => state.items);
  const toast = useToast();

  const handleAddItem = () => {
    setCurrentItem(null);
    onFormOpen();
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    onFormOpen();
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (itemToDelete && user) {
      try {
        await dispatch(
          deleteItem({
            userId: user.uid,
            itemId: itemToDelete,
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete item',
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
          Project Items
        </Text>
        <Button 
          leftIcon={<Plus size={18} />} 
          colorScheme="blue" 
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Flex>

      {items.length === 0 ? (
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
            No items added yet. Click the "Add Item" button to add your first item.
          </Text>
        </Box>
      ) : (
        <TableContainer borderWidth={1} borderRadius="md">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Name</Th>
                <Th isNumeric>Cost</Th>
                <Th width="100px" textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td isNumeric>{formatCurrency(item.cost)}</Td>
                  <Td>
                    <Flex justifyContent="center" gap={2}>
                      <IconButton
                        aria-label="Edit item"
                        icon={<Edit2 size={18} />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditItem(item)}
                      />
                      <IconButton
                        aria-label="Delete item"
                        icon={<Trash2 size={18} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(item.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <ItemForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        currentItem={currentItem}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this item? This action cannot be undone.
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

export default ItemList;