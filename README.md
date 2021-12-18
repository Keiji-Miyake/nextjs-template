# Next.js Template

## Create App

```shell
npx create-next-app .
```

## Setup

```shell
mkdir src
mv pages src/
yarn add --dev typescript @types/react @types/node
```

```package.json
"scripts": {
    "typecheck": "tsc --noEmit"
}
```

```shell
mv src/pages/_app.js src/pages/_app.tsx
mv src/pages/index.js src/pages/index.tsx
yarn dev
```

```tsconfig.json
"strict": true,
```

### Prettier

```shell
yarn add --dev --exact prettier
```

```package.json
"scripts": {
    "format": "prettier --write \"./src/**/*.{ts,tsx}\""
}
```

```.prettierrc
{
    "singleQuote": true,
    "semi": false
}
```

## Chakra UI

```shell
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion @chakra-ui/icons
```

## Jest

```shell
yarn add --dev jest @types/jest ts-jest @testing-library/react
```

```package.json
"scripts": {
    "test": "jest"
}
```

```jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // see https://github.com/zeit/next.js/issues/8663
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  // see https://stackoverflow.com/questions/50863312/jest-gives-cannot-find-module-when-importing-components-with-absolute-paths
  moduleDirectories: ['node_modules', '<rootDir>'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/utils',
  ],
}
```

```tsconfig.jest.json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "jsx": "react"
    }
}
```

## React Testing LibraryのcustomRenderを定義

```src/__test__/utils/index.tsx
import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import React from 'react'
import theme from 'src/theme'

const AllTheProviders = ({ children }: { children: JSX.Element }) => {
 return <ChakraProvider>{children}</ChakraProvider>
}

const customRender = (ui: JSX.Element, options?: any) =>
 render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

## ユニットテストやスナップショットテストを書く

```src/lib/math.ts
esport const add = (a: number, b: number) => a + b
```

```src/lib/math.test.ts
import { add } from './math'

test('add', () => {
  expact(add(1, 1).toEqual(2))
})
```

```src/pages/index.tsx

```
