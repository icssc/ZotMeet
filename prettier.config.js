// @ts-check

/**
 * Prettier plugins only work in VSCode with the `cjs` format.
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/113
 *
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-prisma', 'prettier-plugin-svelte'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
}

export default config
