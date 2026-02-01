import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from "./createCache.js";
import { useRouter as usePagesRouter } from "../nextCompatRouter.cjs";
import { jsx as _jsx } from "react/jsx-runtime";
const defaultEmotionCache = createEmotionCache();
export function AppCacheProvider({
  emotionCache = defaultEmotionCache,
  children
}) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = usePagesRouter();
    if (!router) {
      console.error(['The Pages router CacheProvider is not compatible with the App router.', 'Please use the App Router CacheProvider from `@mui/material-ui-nextjs/vx-appRouter` instead.'].join('n'));
    }
  }
  return /*#__PURE__*/_jsx(CacheProvider, {
    value: emotionCache,
    children: children
  });
}