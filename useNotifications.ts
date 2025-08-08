import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { io } from 'socket.io-client';

const socket = io(process.env.API_URL as string);

async function fetchNotifications(userId: string) {
  const res = await fetch(`/api/notifications?userId=${userId}`);
  return res.json();
}

export function useNotifications(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetchNotifications(userId),
  });

  useEffect(() => {
    socket.emit('register', userId);

    socket.on('notification', (newNotification: any) => {
      queryClient.setQueryData(['notifications', userId], (old: any[] = []) => [
        newNotification,
        ...old,
      ]);
    });

    return () => socket.off('notification');
  }, [userId, queryClient]);

  return query;
}

async function markAsReadRequest(ids: string[]) {
  await fetch('/notifications/read', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

export function useMarkNotificationsRead(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => markAsReadRequest(ids),
    onMutate: async (ids: string[]) => {
      const previousData = queryClient.getQueryData(['notifications', userId]);
      queryClient.setQueryData(['notifications', userId], (old: any[] = []) =>
        old.map((n: any) => (ids.includes(n.id) ? { ...n, read: true } : n))
      );

      return { previousData };
    },
    onError: (_err, _ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications', userId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
  });
}

