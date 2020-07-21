import { combine, createStore } from "effector";
import * as effects from "./effects";
import * as events from "./events";

const $userDetails = createStore({ loading: false, data: null, error: null })
    .on(effects.getUserDetailsEffect.pending, (params, pending) => {
      return {
        ...params,
        loading: pending,
      };
    })
    .on(effects.getUserDetailsEffect.finally, (params, response) => {
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
    })
    .reset(events.resetUserDetailsEvent);

const $countries = createStore({ loading: false, data: [], error: null })
    .on(effects.getCountriesEffect.pending, (params, pending) => {
        return {
            ...params,
            loading: pending,
        };
    })
    .on(effects.getCountriesEffect.finally, (params, response) => {
        if (response.error) {
            return {
                ...params,
                data: [],
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

const $currencies = createStore({ loading: false, data: [], error: null })
    .on(effects.getCurrenciesEffect.pending, (params, pending) => {
        return {
            ...params,
            loading: pending,
        };
    })
    .on(effects.getCurrenciesEffect.finally, (params, response) => {
        if (response.error) {
            return {
                ...params,
                data: [],
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

const $updateUser = createStore({ loading: false, success: false, error: null })
    .on(effects.updateUserEffect.pending, (params, pending) => {
        return {
            ...params,
            loading: pending,
        };
    })
    .on(effects.updateUserEffect.finally, (params, response) => {
        if (response.error) {
            return {
                ...params,
                success: false,
                error: response.error.response.data
            };
        } else {
            return {
                ...params,
                success: true,
                error: null
            };
        }
    })
    .reset(events.resetUpdateUserEvent);

export const $store = combine({
    $userDetails,
    $countries,
    $currencies,
    $updateUser
});
