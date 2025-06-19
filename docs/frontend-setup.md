## Export to PDF

You can now export a report of all applications in the current tab (Production or Non-Production) by clicking the 'Export To PDF' button next to 'Add Application'. The report includes the app name, URL, status, and response time.

### Dependencies
- [jsPDF](https://github.com/parallax/jsPDF)
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

These are installed via npm:

```
npm install jspdf jspdf-autotable
```

### Troubleshooting
If you see an error like `doc.autoTable is not a function`, ensure you are importing and using jsPDF-AutoTable correctly:

```
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
...
autoTable(doc, { ... });
```

## UI/UX Improvements
- Cards are always centered in the tabs container
- There is spacing between the cards and the border of the tabs container
- There is spacing below the cards grid for better visual separation 

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