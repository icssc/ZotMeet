"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentHeadTags = DocumentHeadTags;
exports.createGetInitialProps = createGetInitialProps;
exports.documentGetInitialProps = documentGetInitialProps;
var React = _interopRequireWildcard(require("react"));
var _createInstance = _interopRequireDefault(require("@emotion/server/create-instance"));
var _nextDocument = _interopRequireDefault(require("./nextDocument.cjs"));
var _createCache = _interopRequireDefault(require("./createCache"));
var _jsxRuntime = require("react/jsx-runtime");
var _meta;
const Document = _nextDocument.default.default || _nextDocument.default;
/**
 * A utility to compose multiple `getInitialProps` functions.
 */
function createGetInitialProps(plugins) {
  return async function getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => originalRenderPage({
      enhanceApp: App => plugins.reduce((result, plugin) => plugin.enhanceApp(result), App)
    });
    const initialProps = await Document.getInitialProps(ctx);
    const finalProps = await plugins.reduce(async (result, plugin) => plugin.resolveProps(await result), Promise.resolve(initialProps));
    return finalProps;
  };
}
function DocumentHeadTags(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [_meta || (_meta = /*#__PURE__*/(0, _jsxRuntime.jsx)("meta", {
      name: "emotion-insertion-point",
      content: ""
    })), props.emotionStyleTags]
  });
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
async function documentGetInitialProps(ctx, options) {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = options?.emotionCache ?? (0, _createCache.default)();
  // The createEmotionServer has to be called directly after the cache creation due to the side effect of cache.compat = true,
  // otherwise the <style> tag will not come with the HTML string from the server.
  const {
    extractCriticalToChunks
  } = (0, _createInstance.default)(cache);
  return createGetInitialProps([{
    enhanceApp: App => function EnhanceApp(props) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(App, {
        emotionCache: cache,
        ...props
      });
    },
    resolveProps: async initialProps => {
      const {
        styles
      } = extractCriticalToChunks(initialProps.html);
      return {
        ...initialProps,
        emotionStyleTags: styles.map(style => {
          if (!style.css.trim()) {
            return null;
          }
          const isLayerOrderRule = style.css.startsWith('@layer') && !style.css.match(/\{.*\}/);
          return /*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
            // If the style is a layer order rule, prefix with the cache key to let Emotion hydrate this node.
            // Otherwise, Emotion will hydrate only the non-global styles and they will override the layer order rule.
            "data-emotion": `${isLayerOrderRule ? `${cache.key} ` : ''}${style.key} ${style.ids.join(' ')}`,
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML: {
              __html: style.css
            },
            nonce: cache.nonce
          }, style.key);
        })
      };
    }
  }, ...(options?.plugins ?? [])])(ctx);
}