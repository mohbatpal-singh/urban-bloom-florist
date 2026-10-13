# Urban Bloom Florist — Website Alpha Prototype
**Course:** BBIS 6105 Web Design and Development  
**Assessment:** Assignment 2a — Business Website Design and Alpha Prototype  
**Case Study:** Urban Bloom Florist (Auckland, New Zealand)  
**Technologies:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6+), Local Web Assets  

---

## 🌸 Project Overview

**Urban Bloom Florist** is an independent boutique florist based in Central Auckland, New Zealand. The business crafts fresh seasonal floral bouquets, romantic wedding and event florals, and recurring corporate arrangements.

This website is a front-end business website alpha prototype developed according to the **BBIS 6105 Assignment 2 Case Pack (v1)** and assessed against Learning Outcomes:
* **LO #3:** Select and apply contemporary web design software to design and maintain fit-for-purpose web pages.
* **LO #4:** Use HTML, CSS, and JavaScript to create dynamic effects and manipulate graphic elements for a business website.

---

## 🗂️ Project Directory Structure

```text
urban-bloom-alpha/
├── index.html               # Homepage (Hero, Studio Story, Featured Highlights, Occasions, Value Props, Footer)
├── products.html            # Floral Collection (8 Bouquets, 4 Gift Add-ons, Interactive Filter & Search)
├── services.html            # Weddings & Corporate (Packages, Subscriptions, Pricing Guide, Gallery, Consultation Process)
├── delivery.html            # Delivery & FAQs (Service Area Guidelines, Interactive Suburb Checker, FAQ Accordion)
├── contact.html             # Enquiry & Contact (Studio Info, Opening Hours, Interactive Consultation Quote Builder)
├── css/
│   └── style.css            # Master Design System (CSS Variables, Typography, Responsive Grid, Modals, Animations)
├── js/
│   └── main.js              # Interactive Features (Filter, Search, Quick View, Suburb Checker, Form Validation & Modal)
├── IMAGE_SOURCES.md         # Image source acknowledgement and licence references
└── images/                  # 18 Local Web-Optimised JPEG Images & Brand SVG Favicon
```

---

## 🚀 How to Run Locally

1. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
2. **Zero Dependencies:** No local web server, Node.js build process, database, or backend installation is required. The website runs 100% locally from the file system (`file://`).

---

## 📋 Case Pack Compliance & Mapping

### 1. Business Information (Case Pack Appendix A1)
* **Business Name:** Urban Bloom Florist
* **Location:** Central Auckland, New Zealand
* **Service Area:** Central Auckland and selected suburbs: Ponsonby, Grey Lynn, Parnell, Newmarket, Mount Eden, Epsom, and Remuera.
* **Opening Hours:**
  * Monday – Friday: 8:30 am – 5:30 pm
  * Saturday: 9:00 am – 3:00 pm
  * Sunday: Closed
* **Contact Details:** Phone: `09 000 0001` | Email: `hello@urbanbloom.kiwi`

### 2. Required Floral Products (Case Pack Appendix A2)
All 8 products are faithfully presented on `products.html` and `index.html` with accurate descriptions and indicative prices:
1. **Auckland Sunrise** ($69) — Everyday / Birthday
2. **Soft Blush** ($79) — Anniversary / Thank You
3. **Native Grace** ($85) — Everyday / Congratulations (features NZ native foliage)
4. **Celebration Mix** ($75) — Birthday / Congratulations
5. **Classic Rose Collection** ($95) — Anniversary / Romantic Occasions
6. **Peaceful Wishes** ($89) — Sympathy / Remembrance
7. **Urban Statement Arrangement** (From $120) — Corporate / Events
8. **Seasonal Designer's Choice** (From $70) — Various Occasions

### 3. Gift Add-ons (Case Pack Appendix A3)
Featured on `products.html` and integrated into the live quote calculation on `contact.html`:
* Glass Vase ($25)
* Greeting Card ($8)
* Box of Chocolates ($18)
* Premium Gift Wrapping ($12)

### 4. Weddings & Events (Case Pack Appendix A4)
Presented on `services.html` with indicative pricing (Bridal bouquets from $180, Bridesmaid bouquets from $110, Table arrangements from $95), service listings, and consultation workflow.

### 5. Corporate Services (Case Pack Appendix A5)
Presented on `services.html` covering office arrangements, weekly rotations starting from ~$120, event flowers, and client gifting.

### 6. Delivery Guidelines & Suburb Checker (Case Pack Appendix A6)
Presented on `delivery.html` with standard Mon–Sat delivery, 1 working day notice, and the interactive Suburb Checker tool.

### 7. Frequently Asked Questions (Case Pack Appendix A7)
Presented on `delivery.html` inside an accessible interactive accordion answering all 7 FAQ questions shown on the page.

---

## 🖼️ Image Sources & Acknowledgement

The local image assets are used for the academic alpha prototype. Image source platforms acknowledged: [Unsplash](https://unsplash.com/) and [Pexels](https://www.pexels.com/). Images are used under the respective platform licences; attribution is included here as an acknowledgement even where the licence does not require it. Do not redistribute the image assets separately from this coursework project.

## 💡 Key JavaScript Functionality (Task 5 / LO4)

1. **Mobile Navigation Drawer:** Responsive toggle with ARIA attributes (`aria-expanded`) and outside-click closing.
2. **Dynamic Product Filtering & Live Search (`products.html`):** Real-time category filtering by occasion plus instant text search with live product count badges.
3. **Product Quick View Modal:** Pop-up preview with arrangement photo, description, indicative price, and a direct link to the enquiry form.
4. **Interactive Delivery Suburb Checker (`delivery.html`):** Instant verification of Central Auckland service areas and link to enquiry for custom arrangements.
5. **Interactive Enquiry Form & Live Price Calculator (`contact.html`):**
   * Dynamic URL parameter handling (`?product=...` and `?service=...`) pre-populating form controls.
   * Dynamic calculation of bouquets and optional gift add-ons (delivery confirmed upon enquiry based on location).
   * Client-side validation (required fields, email regex, date notice).
   * Confirmation box that repeats the entered details and states that nothing has been sent.

---

## 📦 Submission Format

The ZIP follows the course naming convention `6105_A2a_Alpha_StudentID_FullName.zip` and contains `index.html`, the other four HTML pages, `README.md`, `IMAGE_SOURCES.md`, `css/`, `js/` and `images/`.

---

## ⚠️ Notes

* **Enquiry form:** the form only checks the details in the browser. Nothing is sent, and the confirmation box says so.
* **Fonts:** Playfair Display and Plus Jakarta Sans load from Google Fonts. Without an internet connection the site falls back to Georgia and system fonts.
* **Images:** all photos come from Unsplash and Pexels. See `IMAGE_SOURCES.md`.
* **Not yet tested:** Firefox, Safari, real phones and a screen reader.
