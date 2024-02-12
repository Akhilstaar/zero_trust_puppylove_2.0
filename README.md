## General

Based on the idea of `https://enkryp.github.io/blog/2024/ZeroTrust/` with some modifications using elliptic curve cryptography by me for generating the shared secret to serve the purpose of function P() as described in the blog.

I've used `secp256k1` curve - the same curve used in Bitcoin wallets to ensure the security & reliability of the generated hashes.

In general any elliptic curve may serve the purpose, provided it is proven secure.

## Start Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.