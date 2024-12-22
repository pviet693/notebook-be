import pluginJs from "@eslint/js";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier,
            import: eslintPluginImport
        },
        rules: {
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "prettier/prettier": [
                "warn",
                {
                    arrowParens: "always",
                    bracketSameLine: false,
                    bracketSpacing: true,
                    semi: true,
                    experimentalTernaries: false,
                    singleQuote: false,
                    jsxSingleQuote: false,
                    quoteProps: "as-needed",
                    trailingComma: "none",
                    singleAttributePerLine: false,
                    htmlWhitespaceSensitivity: "css",
                    vueIndentScriptAndStyle: false,
                    proseWrap: "preserve",
                    insertPragma: false,
                    printWidth: 120,
                    requirePragma: false,
                    tabWidth: 4,
                    useTabs: false,
                    embeddedLanguageFormatting: "auto"
                }
            ],
            "import/order": [
                "warn",
                {
                    groups: [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true
                    },
                    "newlines-between": "always"
                }
            ]
        },
        ignores: ["**/node_modules/", "**/dist/"]
    }
];
