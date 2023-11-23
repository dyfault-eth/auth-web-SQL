import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ path, element }) => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const isTokenValid = checkTokenExpiration();

  return (
    <Routes>
      {isTokenValid ? (
        <Route path={path} element={element} />
      ) : (
        <Route path="/" element={<Navigate to="/auth" />} />
      )}
    </Routes>
  );
};
