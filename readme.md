<h2>Database<h2>

<h4>Need to use postgres database</h4>

<br>

**Run all migrations:**
<h4>npx sequelize-cli db:migrate --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"<h4>

<br>

**Run one migration:**

npx sequelize-cli db:migrate --name file_name.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations" --models-path "src/models"

<br>

**Revert one migraion:**

npx sequelize-cli db:migrate:undo --name file_name.js --env development --config "src/config/db_config.json"  --migrations-path "src/migrations"

<br>

---
<h2>Create .env file<h2>

<h4>Example .env file: </h4>

```json 
PORT=8000
ENVIRONMENT=development # development or production
JWT_SECRET=ANY STRING
```

<br />

---
<h2>Run development server:<h2>
<h4>npm run dev<h4>





