import useSWR from 'swr';

export interface Rate {
  currency: string;
  method: string;
  rate: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRates() {
  const { data, error, isLoading } = useSWR<Rate[]>('/rates.json', fetcher);

  return {
    rates: data,
    isLoading,
    isError: error,
  };
} 