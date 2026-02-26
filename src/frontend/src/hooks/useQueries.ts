import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetBalance() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBalance();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentPin: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.registerUser(paymentPin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useUpdateBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateBalance(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useUpdatePin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (newPin: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updatePin(newPin);
    },
  });
}
