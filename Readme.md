# Storefront Backend Project

## Introduction

This is a storefront backend application, it is responsible for handling products, users and orders made by users

## Requirements

This app requires the following requirements to run:

1. Node.js
2. Postgresql

## Getting Started

After cloning the repo, just run the following command to install all of the required dependencies:

```
npm install
```

once all of the dependencies are installed, you will need to create a `.env` file that includes all of the keys that are present in the `.env.example` file, and make sure to give them all values that are appropriate for them. <br/><br/>
**Hint** : in `.env.example` file, each key has a value that indicates the type/shape of the actual value that should be passed in it.

Once you are done with the `.env` file, simply run the following command :

```
npm run migrate-up
```

with that, the application and the database should be run, and finally you can start the application.

you can run the app by either typing:

```
npm run dev
```

to start the application in the development mode with nodemon<br/>

### or

<br/>

```
npm run start
```

to build and then start it without nodemon

Note: starting the app either way will still start in development mode since there is no production mode.

Finally, a list of all of the scripts avaiable for the app can be found in the `package.json` file

## Endpoints and Schema

The details of the endpoints and database schema could be found in the `REQUIREMENDS.md` file.
