import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../api/src/trpc/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient(token?: string) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/trpc',
        headers() {
          return {
            'x-clerk-user-id': token || '',
          };
        },
      }),
    ],
  });
}
