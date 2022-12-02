# fly Feed

A personal, simple, RSS reader

## Getting started

- Create an account on firebase, or use an existing one
- Create a new project on firebase
- Add these firebase services to the project:
    - hosting
    - authentication
    - firestore database
- Clone this repo
- Add a .env file with these env variables:

```
VITE_APIKEY=<your firebase api key>
VITE_AUTHDOMAIN=<your firebase auth domain>
VITE_PROJECTID=<your firebase project id>
VITE_STORAGEBUCKET=<your firebase storage bucket>
VITE_MESSAGINGSENDERID=<your firebase message sender id>
VITE_APPID=<your firebase app id>
```

- start the project with

```bash
npm run 
```

You can deploy the project on firebase either with a GitHub action or manually, installing firebase on the
project
https://firebase.google.com/docs/web/setup

and then running

```bash
npm run build
firebase deploy 
```

in case of problems or suggestions, pleas, get in touch with me