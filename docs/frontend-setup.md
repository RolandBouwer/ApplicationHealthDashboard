# Frontend Setup

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

## Install dependencies

```sh
cd src/frontend
npm install
```

## Run the development server

```sh
npm run dev
```

The frontend will be available at http://localhost:5173 by default.

## Build for production

```sh
npm run build
```

## Lint and format

```sh
npm run lint
npm run format
```

---

## Export to PDF

You can export a report of all applications in the current tab (Production or Non-Production) by clicking the 'Export To PDF' button next to 'Add Application'. The report includes the app name, URL, status, and response time.

### Dependencies
- [jsPDF](https://github.com/parallax/jsPDF)
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

These are installed via npm:

```sh
npm install jspdf jspdf-autotable
```

### Troubleshooting
If you see an error like `doc.autoTable is not a function`, ensure you are importing and using jsPDF-AutoTable correctly:

```js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
...
autoTable(doc, { ... });
```

---

## UI/UX Improvements
- Cards are always centered in the tabs container
- There is spacing between the cards and the border of the tabs container
- There is spacing below the cards grid for better visual separation

---

## Customizing Branding

### Changing the Favicon
1. Replace the `favicon.ico` file in `src/frontend/public/` with your organization's favicon. Use the same filename (`favicon.ico`).
2. Restart the dev server if running, and refresh your browser (clear cache if needed).

### Replacing the Header Logo
1. Place your new logo file (e.g., `logo.svg` or `logo.png`) in `src/frontend/src/assets/`.
2. In `src/frontend/src/App.jsx`, import your logo at the top:
   ```js
   import logo from './assets/logo.svg'; // or logo.png
   ```
3. Replace the current SVG logo in the AppBar header with:
   ```jsx
   <img src={logo} alt="Logo" className="w-10 h-10 rounded-full mr-2" />
   ```
4. Adjust the size or styling as needed. 