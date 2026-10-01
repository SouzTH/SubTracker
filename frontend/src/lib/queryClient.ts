import { QueryClient } from "@tanstack/react-query";

// Uma única instância compartilhada por toda a aplicação — é ela quem guarda
// o cache das assinaturas, evitando repetir fetch sempre que o usuário volta
// para uma tela já visitada.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000, // 30s: dados considerados "frescos" por um tempo curto
      refetchOnWindowFocus: false,
    },
  },
});

// Chave de cache das assinaturas de um usuário — centralizada aqui para que
// todas as telas invalidem/leiam exatamente a mesma chave.
export const subsQueryKey = (userId: string | undefined) => ["subs", userId] as const;
