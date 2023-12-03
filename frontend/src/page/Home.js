import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';

export const Home = () => {
  const [counterValue, setCounterValue] = useState(0);
  const toast = useToast();
  const storedToken = localStorage.getItem('authToken');

  const handleChange = (valueString) => {
    const intValue = parseInt(valueString, 10);
    setCounterValue(isNaN(intValue) ? 0 : intValue);
  };  

  const handleIncrement = () => {
    setCounterValue(counterValue);
  };

  const handleDecrement = () => {
    setCounterValue(counterValue);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${storedToken}`,
        },
        body: JSON.stringify({ value: counterValue }),
      });

      if (response.ok) {
        toast({
          title: 'Nombre enregistré avec succès!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Erreur lors de l\'enregistrement du nombre.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur s\'est produite lors de l\'enregistrement du nombre.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} width='100px'>
      <FormControl>
        <FormLabel>Nom de l'opération</FormLabel>
        <NumberInput
          defaultValue={counterValue}
          min={0}
          onChange={handleChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper onClick={handleIncrement} />
            <NumberDecrementStepper onClick={handleDecrement} />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Button colorScheme="teal" mt={4} onClick={handleSubmit}>
        Enregistrer le Nombre
      </Button>
    </Box>
  );
};