/** @type {import("prettier").Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@ianvs/prettier-plugin-sort-imports').PluginConfig} */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
  arrowParens: 'avoid',
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSameLine: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
  astroAllowShorthand: true,
  tailwindConfig: './tailwind.config.ts',
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^~/', '^[.][.]/', '^[.]/'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.2.2',
};

export default config;
