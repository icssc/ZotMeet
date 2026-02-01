import * as React from 'react';
import { AppType } from 'next/app';
import { EmotionCache } from '@emotion/react';
import type { DocumentContext, DocumentInitialProps } from 'next/document';
interface Plugin {
  enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType>>) => (props: any) => React.JSX.Element;
  resolveProps: (initialProps: DocumentInitialProps) => Promise<DocumentInitialProps>;
}
/**
 * A utility to compose multiple `getInitialProps` functions.
 */
export declare function createGetInitialProps(plugins: Plugin[]): (ctx: DocumentContext) => Promise<DocumentInitialProps>;
export interface DocumentHeadTagsProps {
  emotionStyleTags: React.ReactElement<unknown>[];
}
export declare function DocumentHeadTags(props: DocumentHeadTagsProps): import("react/jsx-runtime").JSX.Element;
export declare function documentGetInitialProps(ctx: DocumentContext, options?: {
  emotionCache?: EmotionCache;
  plugins?: Plugin[];
}): Promise<import("next/dist/shared/lib/utils").RenderPageResult & {
  styles?: React.ReactElement[] | Iterable<React.ReactNode> | React.JSX.Element;
} & DocumentHeadTagsProps>;
export {};