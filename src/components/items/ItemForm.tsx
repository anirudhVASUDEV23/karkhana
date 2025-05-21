import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { DollarSign, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addItem, updateItem } from '../../store/slices/itemsSlice';
import { Item } from '../../types';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: Item | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ isOpen, onClose, currentItem }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.items);
  const toast = useToast();

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setCost(currentItem.cost.toString());
    } else {
      setName('');
      setCost('');
    }
  }, [currentItem, isOpen]);

  const handleSubmit = async () => {
    if (!name || !cost) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (parseFloat(cost) <= 0) {
      toast({
        title: 'Error',
        description: 'Cost must be greater than zero',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (currentItem) {
        // Update existing item
        await dispatch(
          updateItem({
            userId: user!.uid,
            item: {
              id: currentItem.id,
              name,
              cost: parseFloat(cost),
            },
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new item
        await dispatch(
          addItem({
            userId: user!.uid,
            item: {
              name,
              cost: parseFloat(cost),
            },
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Item added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {currentItem ? 'Edit Item' : 'Add New Item'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormControl id="name" isRequired mb={4}>
              <FormLabel>Item Name</FormLabel>
              <Input
                placeholder="e.g., Laptop, Software License"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="cost" isRequired>
              <FormLabel>Cost</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <DollarSign size={18} color="gray" />
                </InputLeftElement>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </InputGroup>
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            leftIcon={<Save size={18} />}
            onClick={handleSubmit}
            isLoading={loading}
          >
            {currentItem ? 'Update' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemForm;