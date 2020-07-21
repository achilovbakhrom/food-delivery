import { combine, createStore } from "effector";
import * as effects from "./effects";

const $currentUser = createStore({ loading: false, data: null, error: null })
    .on(effects.getCurrentUserEffect.pending, (params, pending) => {
      return {
        ...params,
        loading: pending,
      };
    })
    .on(effects.getCurrentUserEffect.finally, (params, response) => {
      if (response.error) {
        return {
          ...params,
          data: null,
          error: response.error.response
        };
      } else {
        return {
          ...params,
          data: response.result.data,
          error: null
        };
      }
    });

export const $store = combine({
  $currentUser
});
