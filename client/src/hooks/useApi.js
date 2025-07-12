import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = (endpoint, method = 'get') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (payload = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios({
        url: endpoint,
        method,
        data: payload,
      });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method]);

  return { data, loading, error, execute };
};

export default useApi;
