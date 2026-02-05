ENV_FILE = .env

SSH_SERVER = $(shell sed -n 's/^SSH_SERVER=//p' $(ENV_FILE))

SSH_CMD = ssh -q $(SSH_SERVER)

LOAD_NVM_CMD = source ~/.bashrc && export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"

ssh:
	$(SSH_CMD)

deploy:
	$(SSH_CMD) '$(LOAD_NVM_CMD) && cd trading-bot-ai && make production'

check:
	npm run build && \
	npm run format:check && \
	npm run lint

production:
	git pull && \
	npm --silent ci --no-progress && \
	npm run build && \
	npm run migrate && \
	npm run format:check && \
	npm run lint && \
	npm run server:restart && \
	npm run server:status

update-packages:
	npx npm-check-updates -u
