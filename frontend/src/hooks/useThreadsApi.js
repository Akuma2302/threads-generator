import { useState, useCallback } from 'react';
import { fetchLinkPreview, generateThreadContent } from '../services/api';

export function useThreadsApi() {
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchLink = useCallback(async (url) => {
    setError('');
    setIsFetchingLink(true);
    try {
      const data = await fetchLinkPreview(url);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsFetchingLink(false);
    }
  }, []);

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

  return { fetchLink, generate, isFetchingLink, isGenerating, error, setError };
}
