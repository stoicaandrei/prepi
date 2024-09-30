import { router } from "../../trpc";
import { subjectRouter } from "./subject";

export const adminRouter = router({
  subject: subjectRouter,
});
