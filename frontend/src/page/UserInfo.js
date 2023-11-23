import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';

export const UserInfo = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const {userId, checkTokenExpiration} = useContext(AuthContext);
  const storedToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/user-info', {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            setEmail(data.email);
          } else {
            console.error('Erreur lors de la récupération des informations utilisateur.');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur :', error);
        }
      }

    fetchUserInfo();
  }, [storedToken, email, checkTokenExpiration, navigate]);

  const handleChangeEmail = async() => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/update-email/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${storedToken}`,
            },
            body: JSON.stringify({ newEmail, storedToken }),
        });
    
        if (response.ok) {
            const data = await response.json();
    
            const {email} = data
    
            setEmail(email)
        }
    
        console.log('Changer l\'email vers :', newEmail);
        // Mettez à jour l'état si nécessaire
        setEmail(newEmail);
    } catch(e) {
        console.log(e)
    }
  };

  const handleChangePassword = () => {
    // Vous pouvez implémenter ici la logique pour changer le mot de passe côté serveur
    // par exemple, en utilisant une requête fetch vers votre backend
    console.log('Changer le mot de passe vers :', newPassword);
    // Mettez à jour l'état si nécessaire
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Profil Utilisateur</Heading>
      <Text mb={4}>Nom d'utilisateur: {username}</Text>
      <Divider mb={4} />
      <FormControl mb={4}>
        <FormLabel>Email actuel</FormLabel>
        <Text>{email}</Text>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Nouvel Email</FormLabel>
        <Input
          type="email"
          placeholder="Entrez le nouvel email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" mb={4} onClick={handleChangeEmail}>
        Changer l'Email
      </Button>
      <Divider mb={4} />
      <FormControl mb={4}>
        <FormLabel>Nouveau Mot de passe</FormLabel>
        <Input
          type="password"
          placeholder="Entrez le nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" mb={4} onClick={handleChangePassword}>
        Changer le Mot de passe
      </Button>
    </Box>
  );
};
