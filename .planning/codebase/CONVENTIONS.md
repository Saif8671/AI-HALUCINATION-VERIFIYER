# Conventions & Concerns: TrustGuard AI

## Coding Conventions
- **Language**: TypeScript for the frontend, JavaScript for the backend and extension scripts.
- **Component Policy**: Prefer functional components and small composable UI pieces.
- **Styling**: Tailwind utility classes first, with theme tokens defined centrally.
- **Branding**: Keep logo usage consistent and avoid decorative wrappers that change the logo shape unexpectedly.
- **Planning Hygiene**: Update the `.planning` folder when the product shape changes so docs stay aligned with the code.

## Security & Concerns
- **API Keys**: Keep provider keys in environment files and out of committed source.
- **Provider Reliability**: Verification quality depends on upstream model and search provider behavior.
- **JSON Parsing**: Normalized structured output is required to keep the UI stable.
- **CORS**: Lock down production origins before deployment if the API becomes public.
- **Dead Code**: Remove stale backups, unused scripts, and unreferenced components instead of leaving them around.
