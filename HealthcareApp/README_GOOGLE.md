Google Sign-In & Expo — Quick setup

1) Create OAuth credentials
- Go to Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID.
- Create a Web client ID (or Android/iOS if you want native flows).

2) Update `src/config/googleConfig.js`
- Open `HealthcareApp/src/config/googleConfig.js` and replace placeholders with the client IDs you created:

```js
export const GOOGLE_CLIENT_ID = '...';
export const ANDROID_CLIENT_ID = '...';
export const IOS_CLIENT_ID = '...';
```

3) Backend `GOOGLE_CLIENT_ID`
- Use the same web/expo `GOOGLE_CLIENT_ID` in `backend/.env` so the backend can validate the `idToken` audience.

4) Run Expo
- Start Metro and test on device (Expo Go) or emulator:

```bash
cd HealthcareApp
npx expo start
```

5) Test flows
- Register: press "Continuar com Google" → choose account → email/name are prefilled; fill CPF, tipo, senha and finish.
- Login: press "Entrar com Google" → choose account → if account exists the app calls `POST /auth/google/mobile` and logs in.

If you want, provide the three client IDs and I will insert them into `src/config/googleConfig.js` and into `backend/.env` for you.
