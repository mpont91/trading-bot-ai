ENV_FILE = .env

SSH_SERVER := $(shell grep '^SSH_SERVER=' $(ENV_FILE) | cut -d '=' -f2 | tr -d '"')

REMOTE_DIR = trading-bot-ai

PM2_NAME = trading-bot

LOAD_NVM = export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && nvm install

PM2_CMD = ./node_modules/.bin/pm2

SSH_CMD = ssh -q -t $(SSH_SERVER)

REMOTE_EXEC = $(SSH_CMD) 'cd $(REMOTE_DIR) && $(LOAD_NVM) &&

.PHONY: help check update update-force update-ui ssh deploy status logs logs-error logs-history logs-info setup-logs restart stop destroy _server_update _pm2_restart _server_setup_logs

help:
	@npx tsx makefile-help.ts

update:
	@echo "🛡️  [Local] Checking for SAFE updates (Minor & Patch)..."
	npx npm-check-updates -u --target minor
	npm install
	@echo "✅ [Local] Safe updates completed."

update-force:
	@echo "🔥 [Local] Checking for ALL updates (MAJOR versions included)..."
	npx npm-check-updates -u
	npm install
	@echo "⚠️  [Local] Major updates completed. Check for breaking changes!"

update-ui:
	@echo "🕹️  [Local] Starting interactive update..."
	npx npm-check-updates -i --format group
	npm install
	@echo "✅ [Local] Selected updates completed."

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
	$(REMOTE_EXEC) $(PM2_CMD) logs $(PM2_NAME) --lines 100'

logs-error:
	@echo "🚨 [Logs] Showing only ERRORS..."
	$(REMOTE_EXEC) $(PM2_CMD) logs $(PM2_NAME) --err --lines 100'

logs-info:
	@echo "🔍 [Logs] Inspecting log files..."
	$(REMOTE_EXEC) ls -lh ~/.pm2/logs/$(PM2_NAME)*'

setup-logs:
	@echo "🔧 [Setup] Configuring remote logs..."
	$(REMOTE_EXEC) make _server_setup_logs'

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


# ==========================================
# ⚙️ SERVER PROVISIONING
# ==========================================

_server_setup_logs:
	@echo "⚙️ [Server] Configuring Log Rotation (pm2-logrotate)..."
	$(PM2_CMD) install pm2-logrotate
	$(PM2_CMD) set pm2-logrotate:max_size 10M
	$(PM2_CMD) set pm2-logrotate:retain 30
	$(PM2_CMD) set pm2-logrotate:compress true
	$(PM2_CMD) set pm2-logrotate:workerInterval 60
	$(PM2_CMD) set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
	@echo "✅ Log Rotation Configured & Active."