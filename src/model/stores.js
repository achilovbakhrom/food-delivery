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
            const data = response.result.data;
            return {
                ...params,
                data,
                isAdmin: data.roles.indexOf('ADMIN') >= 0,
                isSupervisor: data.roles.indexOf('SUPERVISOR') >= 0,
                isDriver: data.roles.indexOf('DRIVER') >= 0,
                isClient: data.roles.indexOf('CLIENT') >= 0,
                error: null
            };
        }
    });

export const $store = combine({
    $currentUser
});
