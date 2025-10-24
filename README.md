# Custom WordPress Template using secure WP REST APIs 

Structure
- frontend/: static pages and UI
  - home.html: main landing page with hero slider, “Find Your Perfect Home Style,” house‑plan filters, services, and CTAs.
  - header.html, footer.html: global navigation, contact information, license LICENSE_ID_PLACEHOLDER.
  - contact.html, links.html, home-search-modal.html.
  - css/style.css; js/: nav.js, slider.js, dropdown.js, location-dropdown.js, home-seach.js, custom.js.
- backend/: PHP scripts
  - generate-house-search-email-pdf.php: builds PDFs for house-search emails (uses libs/tcpdf).
  - matterport-listing-sync.php: syncs Matterport listings.
- libs/tcpdf/: TCPDF library and fonts bundled for server-side PDF creation.

Deployment notes
- Frontend can be integrated into a WordPress theme or served as static files.
- Backend scripts should be added via `functions.php` or, preferably, implemented as a custom plugin, including the bundled TCPDF library.
