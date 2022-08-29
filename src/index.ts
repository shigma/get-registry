import { exec, execSync } from 'child_process'
import which from 'which-pm-runs'

function get({ cwd }: get.Options = {}) {
  const agent = which()
  const key = agent?.name === 'yarn' && !agent?.version.startsWith('1.') ? 'npmRegistryServer' : 'registry'
  const child = exec([agent?.name || 'npm', 'config', 'get', key].join(' '), { cwd })
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

  export function sync({ cwd }: get.Options = {}) {
    const agent = which()
    const key = agent?.name === 'yarn' && !agent?.version.startsWith('1.') ? 'npmRegistryServer' : 'registry'
    return execSync([agent?.name || 'npm', 'config', 'get', key].join(' '), { cwd }).toString().trim()
  }
}

export = get
