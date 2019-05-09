const { readFileSync, writeFileSync } = require('fs')
const spawn = require('cross-spawn')

const npmCommand = process.argv[2]
const npmArgs = process.argv.slice(3)

const npmProcess = spawn('npm', [npmCommand, ...npmArgs])

npmProcess.stdout.pipe(process.stdout)
npmProcess.stderr.pipe(process.stderr)

npmProcess.addListener('exit', code => {
  if (code === 0) {
    if (npmCommand === 'install' || npmCommand === 'remove') {
      let targetPackage = npmArgs.find(a => !a.startsWith('-'))
      let isDevPackage = !!npmArgs.find(a => a === '-D' || a === '--install-dev')

      if (targetPackage && !isDevPackage) {
        targetPackage = targetPackage.replace(/"/g, '')

        const packageJsonPath = `${__dirname}/../package.json`
        const packageJson = JSON.parse(readFileSync(packageJsonPath).toString())
        const libPackageJsonPath = `${__dirname}/../projects/${packageJson.name}/package.json`
        const libPackageJson = JSON.parse(readFileSync(libPackageJsonPath).toString())

        libPackageJson.peerDependencies = libPackageJson.peerDependencies || {}

        if (npmCommand === 'install') {
          libPackageJson.peerDependencies[targetPackage] = packageJson.dependencies[targetPackage]
        } else if (npmCommand === 'remove') {
          libPackageJson.peerDependencies[targetPackage] = undefined
        }

        writeFileSync(libPackageJsonPath, JSON.stringify(libPackageJson, undefined, 2) + '\n')
      }
    }
  }
})
