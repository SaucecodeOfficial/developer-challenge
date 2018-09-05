import { task } from '../libs'

// exports
export const logHook = task(
  t => hook => {
    const message = t.tags.oneLine`
    ${hook.type}: ${hook.path} - Method: ${hook.method}
    ${t.eq(hook.type, 'error')
      ? `: ${hook.error.message}`
      : ''
      }
    `
    hook.app.info(message)
    hook.app.debug('hook.data', JSON.stringify(hook.data || {}))
    hook.app.debug('hook.params', JSON.stringify(hook.params || {}))

    if (hook.result) {
      hook.app.debug('hook.result', JSON.stringify(hook.result))
    }

    if (hook.error) {
      hook.app.error(hook.error)
    }

    return hook
  },
)