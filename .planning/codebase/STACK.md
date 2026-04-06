# Stack: TrustGuard AI

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Role**: Verification endpoint, provider fallback, response normalization

## Frontend
- **Build Tool**: Vite
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Primitives**: shadcn/ui and Radix-based components
- **Icons**: Lucide React
- **Routing**: react-router-dom
- **State/Data**: @tanstack/react-query and local hook-based state

## Extension
- **Target**: Chrome extension assets in `frontend/extension`
- **Role**: Page-level verification entry points and shared branding

## AI / Verification Providers
- Multi-provider verification stack with sequential fallback
- Claim extraction and trust scoring handled by the backend contract

## Infrastructure
- **Deployment**: Render
