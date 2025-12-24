import { useState, useEffect } from 'react';
import { isAdminAuth } from '../Common/AdminAuth';

const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdminUser = await isAdminAuth();
      setIsAdmin(isAdminUser);
    };

    checkAdmin();
  }, []);

  return isAdmin;
};

export default useAdminAuth;
