import { exec, execSync } from 'child_process'
import which from 'which-pm-runs'

function get({ cwd }: get.Options = {}) {
  const agent = which()
  const key = agent?.name === 'yarn' && !agent?.version.startsWith('1.') ? 'npmRegistryServer' : 'registry'
  let name = agent?.name || 'npm'
  if (agent?.name === 'deno')
    name = 'npm'
  const child = exec([name, 'config', 'get', key].join(' '), { cwd })
  return new Promise<string>((resolve, reject) => {
    let stdout = ''
    child.on('exit', (code) => {
      if (!code) return resolve(stdout.trim())
      if (agent?.name === 'deno') return resolve("https://registry.npmjs.org/")
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
    try {
      return execSync([agent?.name || 'npm', 'config', 'get', key].join(' '), { cwd }).toString().trim()
    } catch {
      return "https://registry.npmjs.org/"
    }
  }
}

export = get
