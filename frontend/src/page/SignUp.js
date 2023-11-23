import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async() => {
    if (password !== confirmPassword) {
      console.log("Les mots de passe ne correspondent pas");
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    
    if (response.ok) {
      setUsername('')
      setPassword('')

      navigate('/auth')
    } else if (response.status === 401) {
      const { message } = await response.json();
      console.log(message)
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Créer un compte</Heading>
      <FormControl mb={4}>
        <FormLabel>Nom d'utilisateur</FormLabel>
        <Input
          type="text"
          placeholder="Entrez votre nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Mot de passe</FormLabel>
        <Input
          type="password"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Confirmer le mot de passe</FormLabel>
        <Input
          type="password"
          placeholder="Confirmez votre mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSignup}>
        Créer un compte
      </Button>
      <Button variant="link" color="teal" onClick={() => navigate('/auth')}>
        Déjà un compte ? Connectez-vous.
      </Button>
    </Box>
  );
};
