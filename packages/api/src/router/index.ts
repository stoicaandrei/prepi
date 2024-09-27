import { router } from "../trpc";
import { authRouter } from "./auth";
import { lessonRouter } from "./lesson";
import { practiceRouter } from "./practice";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  lesson: lessonRouter,
  practice: practiceRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
