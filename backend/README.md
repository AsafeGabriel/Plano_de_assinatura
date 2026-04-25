## Backend — Database & Google setup

This file explains how to set up MongoDB (local or Atlas) and how to configure Google OAuth for the backend.

1) MongoDB (Local via Docker)

Recommended for development: run a local MongoDB container:

```bash
cd backend
docker compose up -d
```

This starts MongoDB on port `27017`. Use the connection string:

```
MONGO_URI=mongodb://localhost:27017/conecta_saude
```

Put that into your `backend/.env` and then start the backend:

```bash
npm install
npm run dev
```

2) MongoDB Atlas (cloud)

- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Create a database user and whitelist your IP (or allow access from anywhere during development).
- Copy the connection string and set `MONGO_URI` in `backend/.env`, e.g.:

```
MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/conecta_saude?retryWrites=true&w=majority"
```

3) Google OAuth (for Sign-In)

- Go to Google Cloud Console → APIs & Services → Credentials.
- Create an OAuth 2.0 Client ID for Web application (or for Android/iOS if using native flows).
- For Expo web redirect URIs use the values recommended by Expo docs. For native Android/iOS, create separate client IDs.

Required values to set in `backend/.env`:

```
GOOGLE_CLIENT_ID=your_web_or_expo_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_if_needed
```

The backend validates the `idToken` audience (`aud`) against `GOOGLE_CLIENT_ID`.

4) Notes
- If you want me to insert your `MONGO_URI` or `GOOGLE_CLIENT_ID` directly into `.env`, provide them and I'll patch the file.
- After updating `.env`, restart the backend:

```bash
# in backend
npm run dev
```