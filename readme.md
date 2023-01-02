<h2>Database<h2>

<h4>Need to use postgres database</h4>

<br>

**Run all migrations:**
<h4>npx sequelize-cli db:migrate --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"<h4>

<br>

**Run one migration:**

npx sequelize-cli db:migrate --name file_name.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"

npx sequelize-cli db:migrate --name 20221101081043-create-users.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"

npx sequelize-cli db:migrate --name create-folders.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"

npx sequelize-cli db:migrate --name 20221101081613-create-notes.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"

npx sequelize-cli db:migrate --name 20221121074107-create-reset-password-code.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"



<br>

**Revert one migraion:**

npx sequelize-cli db:migrate:undo --name file_name.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations"
npx sequelize-cli db:migrate:undo --name 20221101081613-create-notes.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations"

<br>

---
<h2>Create .env file<h2>

<h4>Example .env file: </h4>

```json 
PORT=8000
ENVIRONMENT=development # development or production
JWT_SECRET=ANY STRING
MAILER=email to send verification code to user
MAILER_PASSWORD=app specific password of the email
```

<br />

---
<h2>Run development server:<h2>
<h4>npm run dev<h4>





