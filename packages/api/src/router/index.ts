import { router } from "../trpc";
import { authRouter } from "./auth";
import { lessonRouter } from "./lesson";

export const appRouter = router({
  auth: authRouter,
  lesson: lessonRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
