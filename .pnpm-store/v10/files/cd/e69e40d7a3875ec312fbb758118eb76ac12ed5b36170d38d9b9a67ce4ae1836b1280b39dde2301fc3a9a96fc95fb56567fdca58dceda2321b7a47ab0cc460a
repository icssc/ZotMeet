import * as React from 'react';
import { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
export type AppRouterCacheProviderProps = {
  /**
   * These are the options passed to createCache() from 'import createCache from "@emotion/cache"'.
   */
  options?: Partial<OptionsOfCreateCache> & {
    /**
     * If `true`, the generated styles are wrapped within `@layer mui`.
     * This is useful if you want to override the Material UI's generated styles with different styling solution, like Tailwind CSS, plain CSS etc.
     */
    enableCssLayer?: boolean;
  };
  /**
   * By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"'.
   */
  CacheProvider?: React.ElementType<{
    value: EmotionCache;
  }>;
  children: React.ReactNode;
};
/**
 * Emotion works OK without this provider but it's recommended to use this provider to improve performance.
 * Without it, Emotion will generate a new <style> tag during SSR for every component.
 * See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153 for why it's a problem.
 */
export default function AppRouterCacheProvider(props: AppRouterCacheProviderProps): import("react/jsx-runtime").JSX.Element;