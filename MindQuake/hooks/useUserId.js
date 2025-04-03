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
  }, []);

  return userId;
};

export default useUserId;
