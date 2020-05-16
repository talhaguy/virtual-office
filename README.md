# virtual-office-server

## Prepare .env file

Create a dev `.env` file like so:

```
NODE_ENV=development
PORT=8000
SESSION_SECRET=keyboard cat
DB_PATH=mongodb://localhost/virtualOfficeDev
```

## Reinit database

Build project

```
npm run build
```

Run DB script

```
node dist/build-scripts/index.js
```
