import { useEffect, useState } from 'react';
import { supabase } from '../db/supabase';

const useUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    fetchUser();

    // Escuchar cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return userId;
};

export default useUserId;
