import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
} from '@chakra-ui/react';

export const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { user, token, expiration } = data;

        localStorage.setItem('authToken', token);
        setAuthData(user)


        // Utilisez la fonction navigate pour rediriger l'utilisateur
        navigate('/userinfo');
      } else {
        console.log('Échec de la connexion. Vérifiez vos identifiants.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box width="400px" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading mb={4}>Connexion</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" mt={4} onClick={handleLogin}>
          Connexion
        </Button>
        <Button variant="link" color="teal" onClick={() => navigate('/signup')}>
        Pas encore de compte ? Créez en un.
        </Button>
      </Box>
    </Box>
  );
};
