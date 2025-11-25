# Dark Tech - Project 2025 - ScrollTrap

## Quickstart

1. `cp .env.example .env`
2. `docker compose up -d db`
3. `npm install`
4. `npm run dev`

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```bash
cd existing_repo
git remote add origin https://gitlab.fdmci.hva.nl/studio/dark-tech/templates/dark-tech-project-2025.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.fdmci.hva.nl/studio/dark-tech/templates/dark-tech-project-2025/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

## Beschrijving

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installatie

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Contributing

Dit zijn de regels/afspraken om er voor te zorgen dat onze codebase consistent en overzichtelijk blijft. Documentatie voor dit project is in het **Nederlands** en Code altijd in het **Engels**

### Branches

**main**: De code hier hoort altijd te werken en is vooral bedoelt voor demos
**develop:** hier voegen wij alle features samen
**feature branches:** maak een branch aan per feature/bugfix, bv:

- `feat`/
- `fix`/
- `docs`/

Als deze feature af is kan je een merge/pull-request maken naar de `develop` branch

**Voorbeelden**:

- `feat/infinite-scroll`
- `fix/responsive-layout`
- `docs/update-readme`

---

### Commits

We gebruiken [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) voor commit messages:

**Types:**

- `feat` → nieuwe features
- `fix` → bugfixes
- `docs` → documentatie changes
- `style` → visuele veranderingen
- `refactor` → code-restructure zonder feature/bugfix
- `test` → tests toevoegen/aanpassen
- `chore` → build/CI/config dingen.

---

### Code style

Gebruik **ESLint** + **Prettier** (word geconfigureerd in het project). Hier zijn ook plug-ins voor in bijvoorbeeld vscode. Dan kan je instellen dat als je een bestand opslaat hij deze automatisch formateert met ESlint+Prettier

- **JavaScript/TypeScript:**
  - Tabs = 2 spaties.
  - Single quotes `'` voor strings.
- **React:**
  - Standaard regels uit `eslint-plugin-react` (<https://github.com/jsx-eslint/eslint-plugin-react>)
  - Hooks bovenaan component
  - Componentnamen in PascalCase (bestandsnamen in kebab-case (`filter-component.tsx`)

- **CSS/Styling (Tailwind):**
  - Gebruik Tailwind classes.

---

### Reviews & Pull Requests

- minimaal **1 review** voor elke merge naar **develop**
- Elke commit en PR moeten voldoen aan deze checks (zodra deze tasks bestaan):
  - `npm run lint` → code style check
  - `npm run build` → succesvolle build
  - `npm test` → unit/integration tests
- PR’s moeten bevatten:
  - Beschrijving van de wijziging.
  - Gelinkte issue op gitlab
  - Definition of done

---

### Structuur

Dit is de folder structuur voor de applicatie. Zorg ervoor dat deze ongeveer zo blijft. Als je hier van wilt afwijken laat het dan even weten met een goeie reden.

```
src/
├── assets/
│   ├── achtergrond.png
├── components/
│   ├── common/
│   ├── landing/
│   │   ├── FeatureCard.tsx
├── pages/
│   ├── landing/
│   │   ├── DashBoard.tsx
├── services/
│   ├── UserService.ts
├── hooks/
│   ├── UseLobby.ts
├── router/
│   ├── Router.tsx
├── types/
│    └── user.ts
├── App.tsx
├── main.tsx
```

---
