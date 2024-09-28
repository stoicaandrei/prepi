import { router } from "../trpc";
import { lessonRouter } from "./lesson";
import { practiceRouter } from "./practice";
import { userRouter } from "./user";

export const appRouter = router({
  lesson: lessonRouter,
  practice: practiceRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
