# Rahat Khan Blog — setup

This is a static HTML/CSS/JavaScript blog with Supabase as its article database and Netlify as its host.

## 1. Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run `schema.sql`.
3. In Supabase Authentication, create the admin user using an email address and password.
4. If you want to type a username in the admin form, update `EMAIL_DOMAIN` in `app.js` so the username is converted into the admin email. Supabase password sign-in uses an email, not a standalone username.
5. In **Project Settings → API**, copy the Project URL and publishable/anon key into the `CONFIG` block in `app.js`.

Never put a Supabase `service_role` or secret key in frontend code. The frontend should use only the publishable/anon key.

## 2. Deploy to Netlify

1. Upload this folder to a new GitHub repository, or drag-and-drop the folder in Netlify's manual deploy UI.
2. For GitHub deployment, import the repository in Netlify.
3. No build command is needed. Publish directory: `.` (the repository root).
4. After deployment, visit `/` for the blog and `/admin` for the dashboard.

## 3. Logo

The HTML references `/images/rahat.png`. Add your logo at `images/rahat.png`, or change `LOGO` in `app.js` and the favicon paths in the HTML files.

## Important notes

- The site is not connected to a live Supabase project yet; `app.js` still contains placeholder credentials.
- The current SQL policy grants full post access to authenticated users. For a public-facing site, restrict admin access to a dedicated admin account before using it with real content.
- Do not reuse a password that has been pasted into a chat. Change it if it is a real, active password.
