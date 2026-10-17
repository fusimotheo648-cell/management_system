# CampusDesk — Interactive Student Management System

A responsive React + JavaScript student management dashboard created for the DIWA2110 Web Application Development individual assignment.

## Features

- View student records in a structured, responsive table.
- Add, edit, and delete records using functional modal dialogs.
- Confirm before deleting a student.
- Validate required fields, age (16–100), email format, and duplicate email addresses.
- Search by student name, ID, email, or course.
- Filter by enrollment status and course.
- Dashboard summary cards update as records change.
- Save records in browser `localStorage` so changes remain on the same device/browser.
- Export the currently filtered list to CSV.
- Responsive layout for desktop, tablet, and mobile.
- Custom design uses the supplied palette: `#4A4A4A`, `#CBCBCB`, `#FFFFE3`, and `#6D8196`.

## Requirements

- Node.js 18 or newer recommended
- npm

## Run locally

1. Extract the project ZIP.
2. Open a terminal in the extracted `student-management-system` folder (the folder containing `package.json`).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in the terminal, usually `http://localhost:5173`.

To check the production build:

```bash
npm run build
npm run preview
```

## Deploy to Netlify

1. Create a GitHub repository and upload this project folder. Do **not** upload `node_modules`.
2. Sign in to Netlify and choose **Add new site → Import an existing project**.
3. Connect your GitHub repository.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `dist`.
6. Deploy and open the public URL. Test adding, editing, deleting, search, filters, and refresh.

## Deploy to Vercel

1. Import the GitHub repository in Vercel.
2. Vercel should detect Vite automatically. If asked, use build command `npm run build` and output directory `dist`.
3. Deploy and test the public URL.

## Important notes

- This assignment version stores data in browser localStorage. It is a front-end demonstration, not a shared multi-user database. Records are specific to the browser/device used.
- The initial six records are sample data. Replace them with your own appropriate demonstration data if required by your lecturer.
- Google Fonts are used for typography; system fonts will be used if the font service is unavailable.
- No `node_modules` directory is included. Dependencies are installed from `package.json`.

## Assignment concepts demonstrated

- **Primitive data types:** names, IDs, emails, course and status are strings; age is a number; validation checks produce booleans.
- **Non-primitive data types:** students are stored as an array of objects.
- **`const`:** used for values and functions that are not reassigned.
- **`let`:** not required for the main state logic; React state updates use immutable array operations. If demonstrating `let` in a class explanation, explain that it is appropriate for a variable that must be reassigned.
- **Functions and arrow functions:** validation, ID generation, CSV export, save/delete handlers, and event callbacks.
- **React components:** `App`, `StatCard`, `StatusPill`, `StudentModal`, and `DeleteModal`.
- **State and event handling:** `useState`, `useEffect`, and `useMemo` manage records, forms, search, filters, modals, and feedback.
- **Array methods:** `map`, `filter`, `reduce`, `some`, and `includes`-style matching.
- **Modals:** add/edit form modal and delete confirmation modal.
- **Validation and UX:** required name, valid age, email format, duplicate email prevention, empty state, and toast feedback.

## Manual test checklist

- [ ] Add a valid student and confirm the dashboard count increases.
- [ ] Try submitting with a blank name.
- [ ] Try an age below 16, above 100, or a decimal.
- [ ] Try an invalid email.
- [ ] Try an email already assigned to another student.
- [ ] Edit a student and confirm the table updates without refreshing.
- [ ] Open delete confirmation, cancel it, and confirm the record remains.
- [ ] Confirm deletion and verify the record disappears.
- [ ] Search by name, ID, email, and course.
- [ ] Filter by status and course, then clear the filters.
- [ ] Search for a value with no match and check the empty state.
- [ ] Export CSV and open the downloaded file.
- [ ] Refresh the page and confirm saved records remain in the same browser.
- [ ] Test the layout at mobile width.
- [ ] After deployment, repeat core tests using the public URL.

## Suggested Git commands

```bash
git init
git add .
git commit -m "Build interactive student management system"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your own repository URL.
