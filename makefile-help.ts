import colors from 'colors/safe'

const title = (text: string) => colors.bold(colors.yellow(text))
const header = (text: string) => colors.bold(colors.yellow(text))
const cmd = (text: string) => colors.cyan(text)

console.log(`
🤖  ${title('TRADING BOT MANAGER')} - Available commands:

${header('🚀  Deployment & Control:')}
  ${cmd('make deploy')}       -> 🚀  Full Deploy: Check local -> Pull remote -> Build -> Restart
  ${cmd('make restart')}      -> 🔄  Force restart the remote bot
  ${cmd('make stop')}         -> 🛑  Stop the remote bot
  ${cmd('make destroy')}      -> 💥  Hard remove process from PM2 (Reset)

${header('📊  Monitoring & Logs:')}
  ${cmd('make status')}       -> 📈  Show PM2 status table (CPU/RAM)
  ${cmd('make logs')}         -> 📜  Live feed (Standard output)
  ${cmd('make logs-error')}   -> 🚨  Live feed (Errors only)
  ${cmd('make logs-history')} -> 🕰️  Fetch deep history (Last 1000 lines)
  ${cmd('make logs-info')}    -> 📏  Show log file sizes and location

${header('📦  Local Development:')}
  ${cmd('make check')}        -> 🔍  Audit code (Lint + Build + Format)
  ${cmd('make update')}       -> 🛡️  Safe update (Minor/Patch only)
  ${cmd('make update-force')} -> 🔥  Major update (Warning: Breaking changes)
  ${cmd('make update-ui')}    -> 🎮  Interactive update interface

${header('🛠️  Server Utilities:')}
  ${cmd('make ssh')}          -> 💻  Connect to server terminal
  ${cmd('make setup-logs')}   -> ⚙️  Configure/Fix log rotation on server
`)
