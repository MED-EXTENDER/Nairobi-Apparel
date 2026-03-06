## Packages
zustand | State management for Cart and UI states
clsx | Class name merging
tailwind-merge | Tailwind class merging
lucide-react | Icons
framer-motion | Beautiful page transitions and animations

## Notes
- `tailwind.config.ts` must be extended to support custom fonts defined via CSS variables (`--font-sans`).
- Setting up CSS variables in `index.css` for robust theming (Sunset, Ocean, Forest, Midnight, Amethyst, Monochrome).
- Missing endpoints (like `/api/users`) will purposely error to surface backend gaps for the developer.
- Simulated Paystack checkout visually using local timeouts.
