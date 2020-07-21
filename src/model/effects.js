import { createEffect } from "effector";
import { currentUser } from "../api/auth";

export const getCurrentUserEffect = createEffect({
  handler: currentUser
});