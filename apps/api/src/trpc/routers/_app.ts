import { router } from '../trpc';
import { tripRouter } from './trip';
import { userRouter } from './user';
import { socialRouter } from './social';

export const appRouter = router({
  trip: tripRouter,
  user: userRouter,
  social: socialRouter,
});

export type AppRouter = typeof appRouter;
