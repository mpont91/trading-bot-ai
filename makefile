ENV_FILE = .env

SSH_SERVER := $(shell grep '^SSH_SERVER=' $(ENV_FILE) | cut -d '=' -f2 | tr -d '"')

REMOTE_DIR = trading-bot-ai

PM2_NAME = trading-bot

LOAD_NVM = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"

SSH_CMD = ssh -q -t $(SSH_SERVER)

REMOTE_EXEC = $(SSH_CMD) 'cd $(REMOTE_DIR) && $(LOAD_NVM) &&

.PHONY: help check update ssh deploy status logs restart stop _server_update _pm2_restart

help:
	@echo "🤖 BOT MANAGER - Available commands:"
	@echo "  make deploy   -> Checks local code, pushes changes, and restarts the remote server."
	@echo "  make status   -> Shows the PM2 status on the remote server."
	@echo "  make logs     -> Shows live logs from the remote server."
	@echo "  make restart  -> Forces a restart of the remote bot."
	@echo "  make stop     -> Stops the remote bot."
	@echo "  make update   -> Updates local libraries (npm-check-updates)."
	@echo "  make ssh      -> Connects to the server terminal."

update:
	@echo "⬆️  [Local] Checking for updates..."
	npx npm-check-updates -u
	npm install
	@echo "✅ [Local] Packages updated. Run 'make check' to validate."

check:
	@echo "🔍 [Local] Auditing code..."
	npm run check
	npm run build
	npm run format:check
	npm run lint
	@echo "✅ [Local] Code is healthy."

deploy: check
	@echo "🚀 [Deploy] Connecting to $(SSH_SERVER)..."
	$(REMOTE_EXEC) make _server_update'
	@echo "✅ [Deploy] Bot updated and running!"

status:
	@echo "📊 [Status] Querying server..."
	$(REMOTE_EXEC) pm2 status $(PM2_NAME)'

logs:
	@echo "📜 [Logs] Connecting live feed (Ctrl+C to exit)..."
	$(SSH_CMD) 'pm2 logs $(PM2_NAME)'

restart:
	@echo "🔄 [Restart] Restarting remote process..."
	$(REMOTE_EXEC) make _pm2_restart'

stop:
	@echo "🛑 [Stop] Stopping remote bot..."
	$(REMOTE_EXEC) pm2 stop $(PM2_NAME)'

ssh:
	$(SSH_CMD)


# ==========================================
# 🔒 PRIVATE METHODS (Server Only)
# ==========================================

_server_update:
	@echo "📥 [Server] Git Pull..."
	git pull
	@echo "📦 [Server] Installing deps..."
	npm ci --silent
	@echo "🏗️ [Server] Building..."
	npm run build
	@echo "🚀 [Server] Restarting..."
	make _pm2_restart

_pm2_restart:
	pm2 reload $(PM2_NAME) || pm2 restart $(PM2_NAME) || pm2 start dist/index.js --name "$(PM2_NAME)"
	pm2 save