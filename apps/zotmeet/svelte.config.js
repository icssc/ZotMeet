// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import adapter from '@svelte.kit/adapter-aws'
import { mdsvex } from 'mdsvex'
import { vitePreprocess } from '@sveltejs/kit/vite'

/**
 * Where all Prisma related files are located.
 */
const prismaClientDirectory = path.resolve('node_modules', 'prisma')

/**
 * Name of the schema file.
 */
const prismaSchemaFile = 'schema.prisma'

/**
 * Where the prisma schema is located.
 */
const prismaSchema = path.resolve('prisma', prismaSchemaFile)

/**
 * Name of the Prisma query engine file that's used on AWS Lambda.
 */
const prismaQueryEngineFile = 'libquery_engine-linux-arm64-openssl-1.0.x.so.node'

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess({}),
    mdsvex({
      extensions: ['.md'],
    }),
  ],
  kit: {
    adapter: adapter({
      lambdaUpload: (directory) => {
        fs.copyFileSync(
          path.join(prismaClientDirectory, prismaQueryEngineFile),
          path.join(directory, prismaQueryEngineFile),
        )

        fs.chmodSync(path.join(directory, prismaQueryEngineFile), 0o755)

        fs.copyFileSync(prismaSchema, path.join(directory, prismaSchemaFile))
      },
    }),
    env: {
      dir: '../..',
    },
  },
}

export default config
