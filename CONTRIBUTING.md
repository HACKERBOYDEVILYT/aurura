# 🤝 Contributing to ARURA

Thank you for contributing to the Arura Entertainment Streaming Platform! Please adhere to the guidelines below.

---

## 1. Branching Model (GitFlow)
* `main`: Production-ready releases.
* `develop`: Integration branch for active features.
* Feature branches: `feature/short-description` (e.g. `feature/exoplayer-pip`, `feature/bkash-payment`).
* Bugfix branches: `bugfix/issue-description`.

---

## 2. Commit Message Standards
We follow Conventional Commits format:
```
<type>(<scope>): <short summary>

[optional body]
[optional footer]
```
### Types:
* `feat`: A new user-facing feature.
* `fix`: A bug fix.
* `docs`: Documentation updates.
* `style`: Code style/formatting changes with no logic alterations.
* `refactor`: Code changes that neither fix a bug nor add a feature.
* `perf`: Performance improvements.
* `test`: Adding or updating tests.
* `chore`: Build tasks, package updates, CI/CD configuration.

### Examples:
* `feat(player): add multi-language audio track switching`
* `fix(epg): resolve timezone offset on live channel schedule`
* `docs(readme): update Docker compose setup instructions`

---

## 3. Pull Request (PR) Checklist
Before submitting a PR:
1. Ensure code passes TypeScript compilation: `npm run build` & `npx tsc --noEmit`.
2. Ensure both Bangla and English UI strings are populated in `translations.ts`.
3. Add or update relevant tests.
4. Verify no console errors or unhandled promise rejections occur during playback.
5. Provide screenshots or video recordings for any UI changes.

---

## 4. Code Style & Standards
* **Kotlin**: Follow official Android Kotlin style guide. Use Jetpack Compose idiom (`@Composable`, state hoisting).
* **TypeScript / React**: Functional components with hooks. Prefer Tailwind utility classes over custom CSS.
* **Python**: PEP 8 compliance checked via `flake8`.
