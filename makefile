ENV_FILE = .env

SSH_SERVER := $(shell grep '^SSH_SERVER=' $(ENV_FILE) | cut -d '=' -f2 | tr -d '"')

REMOTE_DIR = trading-bot-ai

PM2_NAME = trading-bot

LOAD_NVM = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && nvm install

PM2_CMD = ./node_modules/.bin/pm2

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
	@echo "  make destroy  -> Removes the remote bot from pm2 (Hard Reset)."
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
	$(REMOTE_EXEC) $(PM2_CMD) status $(PM2_NAME)'

logs:
	@echo "📜 [Logs] Connecting live feed (Ctrl+C to exit)..."
	$(REMOTE_EXEC) $(PM2_CMD) logs $(PM2_NAME)'

restart:
	@echo "🔄 [Restart] Restarting remote process..."
	$(REMOTE_EXEC) make _pm2_restart'

stop:
	@echo "🛑 [Stop] Stopping remote bot..."
	$(REMOTE_EXEC) $(PM2_CMD) stop $(PM2_NAME)'

destroy:
	@echo "💥 [Destroy] Removing process and persistence..."
	$(REMOTE_EXEC) $(PM2_CMD) delete $(PM2_NAME) || true && $(PM2_CMD) save'

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
	@echo "💎 [Server] Prisma Generate..."
	npx prisma generate
	@echo "🏗️ [Server] Building..."
	npm run build
	@echo "🗄️ [Server] Migrating Database..."
	npx prisma migrate deploy
	@echo "🚀 [Server] Restarting..."
	make _pm2_restart

_pm2_restart:
	$(PM2_CMD) reload ecosystem.config.cjs || $(PM2_CMD) start ecosystem.config.cjs
	$(PM2_CMD) save