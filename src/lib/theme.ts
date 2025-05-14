/*---------------------------------------------------------------------------
 * theme.ts
 *
 * Manage themes.
 *---------------------------------------------------------------------------*/
import { browser } from "$app/environment";
import { writable } from "svelte/store";

import type { Writable } from "svelte/store";

export const Themes = {
  Light: "light",
  Dark: "dark",
} as const;

export type Theme = (typeof Themes)[keyof typeof Themes];

function getCurrentTheme(): Theme {
  if (!browser) return Themes.Dark; // TODO

  // Note:
  // The initial value of documentElement.dataset.theme is undefined.
  const t = document.documentElement.dataset["theme"];
  if (t === undefined) {
    document.documentElement.dataset["theme"] = Themes.Dark;
  }

  return t === Themes.Dark ? Themes.Dark : Themes.Light;
}

function createThemeStore(): Writable<Theme> & { switch: () => void } {
  const { subscribe, set, update } = writable<Theme>(getCurrentTheme());

  return {
    subscribe,
    set,
    update,
    switch: () => {
      const next =
        getCurrentTheme() === Themes.Dark ? Themes.Light : Themes.Dark;
      if (browser) {
        document.documentElement.dataset["theme"] = next;
      }
      set(next);
    },
  };
}

export const theme = createThemeStore();
