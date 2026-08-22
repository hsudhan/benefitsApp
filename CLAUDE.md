@AGENTS.md
# Claude Development Guidelines & Coding Standards

## Core Architecture & Separation of Concerns
- **MVC Pattern**: Strict Model-View-Controller separation. Models handle data and business logic, Views handle presentation/UI, and Controllers manage flow between them.
- **Data Decoupling**: Keep data layers completely separate from views and UI components. Views must never query databases or manage raw data states directly.
- **Client/Server Loose Coupling**: Maintain clear contracts via REST or gRPC APIs. Clients and servers must not share internal state or tight dependencies.
- **Microservices**: Keep services independently deployable, loosely coupled, and bounded by single-responsibility domain logic.

## Frontend Standards (React.js & CSS)
- **Component Design**: Build modular, reusable functional React components with hooks.
- **CSS Separation**: Write all styles in dedicated CSS/SCSS modules or external stylesheet files. Never use inline `style={{...}}` props in React.
- **No Inline JS**: Keep complex JavaScript logic outside of JSX markup; extract helper functions or custom hooks.

## Backend Standards (Node.js)
- **Asynchronous Code**: Use async/await syntax consistently for all I/O and database operations.
- **Error Handling**: Implement centralized error-handling middleware and avoid unhandled promise rejections.
- **Validation**: Validate all incoming payloads and environment variables at entry points.

## Anti-Patterns / "Things to Avoid" (Guardrails)
- **No Raw Data File Access**: Do not read, write, or modify raw data files (JSON/CSV/TXT) directly inside application runtime or components. Use proper database or service layers.
- **No Deprecated Methods**: Never use deprecated Node.js APIs, legacy React lifecycle methods, or outdated third-party packages.
- **No Hardcoded Variables**: Do not hardcode configuration values, secrets, URLs, or magic numbers. Use environment variables via `process.env`.
- **No Inline Styles**: Never use inline `style` attributes in HTML/JSX.
- **No Tight Coupling**: Do not import backend database models or direct server code into frontend client packages.
- **No Business Logic in Views**: Do not place heavy calculations, database queries, or domain logic inside UI/view components.

