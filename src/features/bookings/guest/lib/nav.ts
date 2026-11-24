import { router as expoRouter, usePathname, useRouter as useExpoRouter } from 'expo-router';
import { useMemo, useRef } from 'react';

import { switchTo } from '@/core/stores/switchStore';

/** Where the module is mounted in the Groups app. Screens keep their own short paths ("/apartments"); this adds the prefix. */
export const BASE = '/serene-bookings';

/** After one navigation starts, further push / navigate calls are ignored for this long. */
const LOCK_MS = 450;
/** Screens that must only ever exist once in the stack. */
const SINGLE = [`${BASE}/menu`, `${BASE}/login`];

let lockedUntil = 0;

const prefix = (path: string) => (path === '/' ? BASE : `${BASE}${path}`);

/** "/room/x" or { pathname: "/stay", params } -> the same, under BASE. */
const inModule = (href: unknown): unknown => (typeof href === 'string' ? prefix(href) : { ...(href as object), pathname: prefix((href as { pathname: string }).pathname) });

const pathOf = (href: unknown): string => {
  const raw = typeof href === 'string' ? href : ((href as { pathname?: string })?.pathname ?? '');
  return raw.split('?')[0].split('#')[0];
};

/** Leaves Serene Bookings: everything above the Groups tabs is dismissed at once. */
export const exitToGroups = () => switchTo('Serene Groups', () => expoRouter.dismissTo('/'));

/**
 * `useRouter` for the module: adds BASE, and guards taps. push / navigate / replace are ignored while another navigation was
 * started in the last 450 ms, and the menu and sign-in are never opened on top of themselves. back / dismiss are untouched.
 */
export function useRouter() {
  const router = useExpoRouter();
  const pathname = usePathname();
  const current = useRef(pathname);
  current.current = pathname;

  return useMemo(() => {
    const guard =
      (fn: (...args: never[]) => void) =>
      (href: unknown, ...rest: unknown[]) => {
        const now = Date.now();
        if (now < lockedUntil) return;
        const target = inModule(href);
        const path = pathOf(target);
        if (SINGLE.includes(path) && current.current === path) return;
        lockedUntil = now + LOCK_MS;
        (fn as (...a: unknown[]) => void)(target, ...rest);
      };
    return {
      ...router,
      push: guard(router.push as (...a: never[]) => void) as typeof router.push,
      navigate: guard(router.navigate as (...a: never[]) => void) as typeof router.navigate,
      replace: guard(router.replace as (...a: never[]) => void) as typeof router.replace,
    };
  }, [router]);
}
