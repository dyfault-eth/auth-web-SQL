import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './page/AuthPage';
import { UserInfo } from './page/UserInfo';
import { SignUp } from './page/SignUp';
import { PrivateRoute } from './routes/PrivateRoute';
import { Box } from '@chakra-ui/react';
import {Home} from './page/Home';
import { Meeting } from './page/Meeting';

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path='/home' element={<Home/>} />
        <Route path='/meeting' element={<Meeting/>} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>

      <PrivateRoute path="/home" element={<Home />} />
    </Box>
  );
};

export default App;
