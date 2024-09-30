import { router } from "../trpc";
import { lessonRouter } from "./lesson";
import { practiceRouter } from "./practice";
import { userRouter } from "./user";
import { adminRouter } from "./admin";

export const appRouter = router({
  lesson: lessonRouter,
  practice: practiceRouter,
  user: userRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
