import { router } from "../trpc";
import { lessonRouter } from "./lesson";
import { practiceRouter } from "./practice";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { examRouter } from "./exam";
import { stripeRouter } from "./stripe";
import { assessmentRouter } from "./assessment";

export const appRouter = router({
  lesson: lessonRouter,
  practice: practiceRouter,
  user: userRouter,
  admin: adminRouter,
  exam: examRouter,
  stripe: stripeRouter,
  assessment: assessmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
