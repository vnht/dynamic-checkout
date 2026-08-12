# Dynamic Checkout AUD Demo

Front-end simulation of Hello Clever **Dynamic Checkout** for an Australian consumer electronics merchant (**Circuit & Co.**).

## Stack

- React + TypeScript + Vite
- React Router
- Local mock state only (no payment APIs, no env vars)

## Run

```bash
npm install
npm run dev
```

Open the local URL, then use **Demo tools** (bottom-right) to switch among **12 customer profiles** (recognised + guest) and reset.

## Routes

- `/cart` — electronics cart
- `/checkout` — contact and delivery (merchant checkout)
- `/pay` — Hello Clever payment gateway (ranked methods + authorisation)
- `/order/confirmed` — receipt + collapsible demo insight

## Demo cards

- Success: `4242 4242 4242 4242` · `MIA CHEN` · `12/30` · `123`
- Decline: `4000 0000 0000 0002`

## Brand

Merchant-first Circuit & Co. UI with Hello Clever payment styling and attribution. See `docs/hello-clever-brand.md`.
