import which from 'which-pm-runs'
import spawn from 'execa'

function get({ cwd }: get.Options = {}) {
  const agent = which()
  const key = agent?.name === 'yarn' && !agent?.version.startsWith('1.') ? 'npmRegistryServer' : 'registry'
  const child = spawn(agent?.name || 'npm', ['config', 'get', key], { cwd })
  return new Promise<string>((resolve, reject) => {
    let stdout = ''
    child.on('exit', (code) => {
      if (!code) return resolve(stdout.trim())
      reject(new Error(`child process exited with code ${code}`))
    })
    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })
  })
}

namespace get {
  export interface Options {
    cwd?: string
  }
}

export = get
