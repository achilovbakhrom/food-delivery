import { createEffect } from "effector";
import { getUserDetails, updateUser } from "../../api/admin";
import { fetchCountries, fetchCurrencies } from "../../api/auth";

export const getUserDetailsEffect = createEffect({
  handler: getUserDetails
});

export const getCountriesEffect = createEffect({
  handler: fetchCountries
});

export const getCurrenciesEffect = createEffect({
  handler: fetchCurrencies
});

export const updateUserEffect = createEffect({
  handler: updateUser
});