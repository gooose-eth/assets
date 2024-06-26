import fs from 'bun:fs'
import { build } from 'esbuild'
import { umdWrapper } from 'esbuild-plugin-umd-wrapper'
import { ESPluginTextCss } from './libs/esbuild.js'

const pathDest = '../../dest/components'
const completeObjectName = 'Goose'

function getDirectoryPath()
{
  let result = []
  const files = fs.readdirSync('src/components', { withFileTypes: true })
  files.forEach(file => {
    if (!file.isDirectory()) return
    const name = file.name
    const path = `${file.path}/${name}`
    if (!fs.existsSync(`${path}/index.js`)) return
    result.push({
      name,
      path: `${path}/index.js`,
    })
  })
  return result
}

async function compile({ name, path })
{
  await build({
    platform: 'browser',
    outfile: `${pathDest}/${name}/index.js`,
    bundle: true,
    minify: true,
    format: 'esm',
    entryPoints: [ path ],
    plugins: [ ESPluginTextCss ],
  })
  return true
}

async function createComplete(components)
{
  const baseOptions = {
    platform: 'browser',
    bundle: true,
    minify: true,
    plugins: [ ESPluginTextCss ],
  }
  // build umd
  await build({
    ...baseOptions,
    format: 'umd',
    entryPoints: [ 'src/components/index.js' ],
    outfile: `${pathDest}/index.js`,
    plugins: [
      ...baseOptions.plugins,
      umdWrapper({
        libraryName: completeObjectName,
      }),
    ],
  })
  // build custom elements
  await build({
    ...baseOptions,
    format: 'cjs',
    entryPoints: [ 'src/components/custom-elements.js' ],
    outfile: `${pathDest}/custom-elements.js`,
  })
}

function compileComponents()
{
  return {
    name: 'compile-components',
    apply: 'build',
    closeBundle()
    {
      // get component info
      const components = getDirectoryPath()
      // build component classes
      Promise.all(components.map(compile)).then()
      // create exports.js file
      createComplete(components).then()
    },
  }
}

export default compileComponents
