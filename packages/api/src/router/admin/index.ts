import { router } from "../../trpc";
import { subjectRouter } from "./subject";
import { invitationCodeRouter } from "./invitationCode";

export const adminRouter = router({
  subject: subjectRouter,
  invitationCode: invitationCodeRouter,
});
