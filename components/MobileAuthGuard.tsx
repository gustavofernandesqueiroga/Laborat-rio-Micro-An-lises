
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isAuthPath = ['/login', '/cadastro', '/recuperar-acesso'].includes(location.pathname);

    if (!loading && isMobile && !isAuthenticated && !isAuthPath) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  return <>{children}</>;
};

export default MobileAuthGuard;
