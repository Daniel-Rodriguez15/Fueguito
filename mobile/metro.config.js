const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const repoRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

// The domain/application/infrastructure layers live in the repo root and are
// shared with the web app. `@/...` imports inside those files resolve here.
config.watchFolders = [path.resolve(repoRoot, 'src')]
config.resolver.extraNodeModules = {
  '@': path.resolve(repoRoot, 'src'),
}

module.exports = config
