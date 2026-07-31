import { useState, useCallback } from 'react';
import { generateThreadContent } from '../services/api';

export function useThreadsApi() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async (payload) => {
    setError('');
    setIsGenerating(true);
    try {
      const data = await generateThreadContent(payload);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, error, setError };
}
