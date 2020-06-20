# Virtual Office

## Prerequisite Installations

-   Node
-   MongoDB

## How To Run

### Prepare .env file

Create a dev `.env` file in the repo root like so:

```
NODE_ENV=development
PORT=8000
SESSION_SECRET=penguinmonkey
DB_PATH=mongodb://localhost/virtualOfficeDev
```

### Build Code

```
npm run build:all
```

### Start server

```
npm run start
```

## Other Commands

### Build server

```
npm run server:build
```

### Build client

```
npm run client:build
```

### Reinit database

Build the server

```
npm run server:build
```

Run DB script

```
npm run db:reinit
```
