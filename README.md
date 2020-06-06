# virtual-office-server

## Prepare .env file

Create a dev `.env` file like so:

```
NODE_ENV=development
PORT=8000
SESSION_SECRET=keyboard cat
DB_PATH=mongodb://localhost/virtualOfficeDev
```

## Build server

```
npm run server:build
```

## Build client

```
npm run client:build
```

## Build both server and client

```
npm run build
```

## Reinit database

Build the server

```
npm run server:build
```

Run DB script

```
npm run db:reinit
```
