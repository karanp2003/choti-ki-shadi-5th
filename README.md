# 🌸 Antima & Saksham — Digital Wedding Invitation Website

An elegant, luxury **Blush & Gold** digital wedding invitation website crafted for **Antima Gupta & Saksham Mathur**, identical to the official **InviteVibes Blush & Gold** theme with the exact original song, envelope animation, and requested event schedule.

---

## 💍 Event Itinerary Included

* **Haldi Ceremony**: Friday, 4 December 2026 — Lunch Time (12:30 PM Onwards)  
  *Attire:* Shades of Yellow & Marigold  
  *Venue:* Poolside Lawns & Courtyard

* **Sangeet & Musical Night**: Friday, 4 December 2026 — Night (7:30 PM Onwards)  
  *Attire:* Dark & Dazzling Glam / Indo-Western  
  *Venue:* Grand Crystal Ballroom

* **Wedding Ceremony (Phere)**: Saturday, 5 December 2026 — Day (10:30 AM – 2:00 PM)  
  *Attire:* Traditional Festive / Pastel & Royal Indian  
  *Venue:* Mandapam Royal Heritage Palace

---

## ✨ Features Included

1. **Exact Blush & Gold Envelope Opening Gate**:
   * Official HD blush pink & wax seal envelope opening video (`1 (8).mp4`).
   * "With love and blessings..." monogram with `A&S` and tap-to-open gesture.
   * Smooth dissolve transition into the invitation.

2. **Original Romantic Bollywood Song**:
   * Authentic romantic acoustic song from InviteVibes Blush & Gold (`ReelAudio-14254.mp3`).
   * Floating audio button with spinning vinyl disc animation and audio equalizer wave visualizer.

3. **Soft Rose Petal & Gold Glitter Rain Canvas**:
   * High-performance floating particles with soft blush rose petals and golden bokeh dust.

4. **Hero Section**:
   * Auspicious Shree Ganeshay Namah crest.
   * **Antima Gupta** with **Saksham Mathur** in elegant calligraphy.
   * Save the Date badge: Saturday, 5th December 2026.

5. **Live Real-time Countdown Timer**:
   * Real-time ticking counter showing Days, Hours, Minutes, and Seconds until 5 December 2026.

6. **Wedding Festivities / Events Cards**:
   * Dedicated cards for Haldi (4 Dec - Lunch), Sangeet (4 Dec - Night), and Wedding Ceremony (5 Dec - Day).
   * Color swatch dots showing recommended attire shades for each event.
   * Direct Google Maps navigation buttons.

7. **Our Story (Polaroids)**:
   * Playfully tilted polaroid photo cards with captions and memories.

8. **Digital RSVP with Direct WhatsApp Integration**:
   * Guests enter Name, Phone, Attendance (*Joyfully accept 🎉 / Regrettably decline*), Guest count, Events attending checkboxes, and blessings.
   * **"Send RSVP on WhatsApp"** button: Automatically pre-fills a neat WhatsApp message and opens WhatsApp to the family coordinator's phone.

---

## 🚀 How to Run Locally

The website is running live locally on:
👉 **http://localhost:3000**

You can also simply double-click `index.html` in your file manager to open it in Chrome, Edge, or Safari.

To start or restart the server:
```bash
node server.js
```

---

## ✏️ Customization (wedding-config.js)

All settings (names, dates, WhatsApp number, venues) are located in **[`wedding-config.js`](./wedding-config.js)**.

To set your phone number for receiving WhatsApp RSVPs:
```javascript
rsvp: {
  whatsappNumber: "919876543210", // Your 10-digit number with country code (91)
}
```

---

## 🌐 1-Click Free Deployment (Share on WhatsApp)

* **Via Netlify:** Go to [netlify.com/drop](https://app.netlify.com/drop) and drag-and-drop this folder.
* **Via Vercel:** Open terminal and run `npx vercel`.
