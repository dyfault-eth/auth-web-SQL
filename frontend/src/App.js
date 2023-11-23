import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './page/AuthPage';
import { UserInfo } from './page/UserInfo';
import { SignUp } from './page/SignUp';
import { PrivateRoute } from './routes/PrivateRoute';
import { Box } from '@chakra-ui/react';

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Navigate to="/auth" />} />
      </Routes>

      <PrivateRoute path="/userinfo" element={<UserInfo />} />
    </Box>
  );
};

export default App;
