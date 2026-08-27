# Shopwus

A luxury studio and shop management platform and client-facing digital showcase application for service, product, and goods providers, built with Next.js 16, React 19, and Tailwind CSS.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18+ or v20+ recommended
- **Package Manager**: [`pnpm`](https://pnpm.io/) (preferred), `npm`, or `yarn`

---

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ajibade3210/shopwus.git
   cd shopwus
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

---

### Starting the Development Server

To run the application locally in development mode:

```bash
pnpm dev
# or
npm run dev
```

Once started, the application will be running at:

- **Studio Admin & Settings**: [http://localhost:3000/settings](http://localhost:3000/settings) (or [http://localhost:3000/](http://localhost:3000/))
- **Live Client Showcase Profile**: [http://localhost:3000/elan-events](http://localhost:3000/elan-events)

---

### Stopping the Development Server

Press `Ctrl + C` (or `Cmd + C` on macOS) in your terminal where the dev server is running.

---

### Building for Production

1. **Build the production bundle**:

   ```bash
   pnpm build
   ```

2. **Start the production server**:
   ```bash
   pnpm start
   ```

---

## 📂 Project Routes & Structure

| Route                           | Description                                                                  |
| :------------------------------ | :--------------------------------------------------------------------------- |
| `/`                             | Admin Dashboard (Leads, Metrics, & Recent Inquiries)                         |
| `/settings`                     | Studio Settings & Live Profile (Brand Logo, Slug, Operating Hours, Channels) |
| `/[slug]` (e.g. `/elan-events`) | Public Light-Mode Luxury Client Showcase & 3D Interactive Studio Card        |
| `/login`                        | Studio Portal Authentication                                                 |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS tokens & [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type Safety**: TypeScript 5.7+
