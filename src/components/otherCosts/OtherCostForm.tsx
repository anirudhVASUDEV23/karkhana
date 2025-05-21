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
import { addOtherCost, updateOtherCost } from '../../store/slices/otherCostsSlice';
import { OtherCost } from '../../types';

interface OtherCostFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentCost: OtherCost | null;
}

const OtherCostForm: React.FC<OtherCostFormProps> = ({ isOpen, onClose, currentCost }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.otherCosts);
  const toast = useToast();

  useEffect(() => {
    if (currentCost) {
      setDescription(currentCost.description);
      setAmount(currentCost.amount.toString());
    } else {
      setDescription('');
      setAmount('');
    }
  }, [currentCost, isOpen]);

  const handleSubmit = async () => {
    if (!description || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: 'Error',
        description: 'Amount must be greater than zero',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (currentCost) {
        // Update existing cost
        await dispatch(
          updateOtherCost({
            userId: user!.uid,
            otherCost: {
              id: currentCost.id,
              description,
              amount: parseFloat(amount),
            },
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Cost updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new cost
        await dispatch(
          addOtherCost({
            userId: user!.uid,
            otherCost: {
              description,
              amount: parseFloat(amount),
            },
          })
        ).unwrap();
        toast({
          title: 'Success',
          description: 'Cost added successfully',
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
          {currentCost ? 'Edit Other Cost' : 'Add Other Cost'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormControl id="description" isRequired mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="e.g., Shipping, Taxes, Consulting fee"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl id="amount" isRequired>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <DollarSign size={18} color="gray" />
                </InputLeftElement>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
            colorScheme="teal" 
            leftIcon={<Save size={18} />}
            onClick={handleSubmit}
            isLoading={loading}
          >
            {currentCost ? 'Update' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtherCostForm;