### A base TSConfig for working with Bun.

Add the package to your `"devDependencies"`:

```sh
npm install --save-dev @tsconfig/bun
yarn add --dev @tsconfig/bun
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/bun/tsconfig.json"
```

---

The `tsconfig.json`: 

```jsonc
{
  // This is based on https://bun.sh/docs/typescript#suggested-compileroptions
  "$schema": "https://json.schemastore.org/tsconfig",
  "docs": "https://bun.sh/docs/typescript",

  "compilerOptions": {
    // Enable latest features
    "lib": ["ESNext", "DOM"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,

    // Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    // Best practices
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,

    // Some stricter flags
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noPropertyAccessFromIndexSignature": true
  }
}

```

You can find the [code here](https://github.com/tsconfig/bases/blob/master/bases/bun.json).
