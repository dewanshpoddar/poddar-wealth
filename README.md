# Poddar Wealth — Insurance Advisory Website

A modern, bilingual (English + Hindi) insurance advisory website for Ajay Poddar — 27+ years experience, MDRT member.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
poddar-wealth/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── globals.css             # Global styles + Tailwind
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── become-advisor/page.tsx
│   ├── services/
│   │   ├── life-insurance/
│   │   ├── health-insurance/
│   │   ├── retirement/
│   │   └── child-planning/
│   └── calculators/
│       ├── life-insurance/
│       └── retirement/
├── components/                 # Reusable components
│   ├── Navbar.tsx              # Navigation + language toggle
│   ├── HeroSection.tsx         # Homepage hero
│   ├── IntentSection.tsx       # "What are you looking for?"
│   ├── ProblemSolutionSection.tsx
│   ├── CalculatorSection.tsx
│   ├── TrustSection.tsx        # Ajay Poddar credentials
│   ├── ServicesSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── LeadForm.tsx            # Lead capture form
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx      # Floating WhatsApp button
│   └── ChatBot.tsx             # Basic chatbot UI
├── lib/
│   ├── LangContext.tsx         # Language context provider
│   ├── en.json                 # English translations
│   └── hi.json                 # Hindi translations
└── tailwind.config.js
```

## 🌐 Features

- **Bilingual**: Full English ↔ Hindi toggle (EN | हिंदी)
- **Lead Generation**: WhatsApp integration + lead forms
- **Interactive Calculators**: Life Insurance + Retirement corpus
- **Emotional Design**: Indian family imagery, trust-building
- **Mobile-First**: Fully responsive on all devices
- **Chatbot**: Basic FAQ chatbot with smart replies
- **Performance**: Next.js 14 App Router, optimized images

## 🎨 Design System

- **Primary**: Blue (#1d4ed8) — Trust & Security
- **Accent**: Orange (#f97316) — Energy & Action
- **Fonts**: Fraunces (display) + Plus Jakarta Sans (body)
- **Style**: Clean, minimal, warm — inspired by Lemonade Insurance

## ⚙️ Customization

### Change WhatsApp Number
In `lib/en.json` and `lib/hi.json`:
```json
"whatsapp": {
  "number": "91XXXXXXXXXX"  // Country code + number, no spaces
}
```

### Add/Edit Content
All text content is in `lib/en.json` (English) and `lib/hi.json` (Hindi).

### Change Images
Images use Unsplash URLs. Replace with your own images in each component.

### IRDAI Details
Update IRDAI registration number in footer translations.

## 📞 WhatsApp Integration

The floating WhatsApp button and all CTA buttons link to:
`https://wa.me/{number}` with pre-filled message.

Update the number in translation files under `whatsapp.number`.

## 🚀 Deployment

Deploy on Vercel (recommended):
```bash
npx vercel
```

Or build and deploy to any Node.js host:
```bash
npm run build
npm start
```

---

Built with ❤️ for Poddar Wealth — Protecting Indian families since 1997.
