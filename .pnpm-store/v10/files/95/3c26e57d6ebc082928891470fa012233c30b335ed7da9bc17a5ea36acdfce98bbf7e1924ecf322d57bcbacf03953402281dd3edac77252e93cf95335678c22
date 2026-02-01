"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppCacheProvider = AppCacheProvider;
var React = _interopRequireWildcard(require("react"));
var _react2 = require("@emotion/react");
var _createCache = _interopRequireDefault(require("./createCache"));
var _nextCompatRouter = require("../nextCompatRouter.cjs");
var _jsxRuntime = require("react/jsx-runtime");
const defaultEmotionCache = (0, _createCache.default)();
function AppCacheProvider({
  emotionCache = defaultEmotionCache,
  children
}) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = (0, _nextCompatRouter.useRouter)();
    if (!router) {
      console.error(['The Pages router CacheProvider is not compatible with the App router.', 'Please use the App Router CacheProvider from `@mui/material-ui-nextjs/vx-appRouter` instead.'].join('n'));
    }
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.CacheProvider, {
    value: emotionCache,
    children: children
  });
}