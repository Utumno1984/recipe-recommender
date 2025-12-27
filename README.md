# Recipe Recommender App 🥘

A React smart-finder application that helps users decide what to cook based on their preferences (Cuisine and Ingredient).
Built as a solution for the "Two-Step Recommender" developer exercise, strictly adhering to the requirements while adding premium UX enhancements.

## Features ✨

- **Two-Step Wizard (Strict MVP)**:
  - **Step 1**: Choose a Cuisine (Area) from dynamic options.
  - **Step 2**: Search for a Main Ingredient with **real-time autocomplete** filtering (Dynamic Search).
- **Smart Recommendation Engine**:
  - **Randomized Discovery**: Results are shuffled (Fisher-Yates) to ensure variety.
  - **Premium Detail View**: Displays High-Res Image, Category Badge, and a direct **Link** to the full recipe/video.
  - **"New Idea" Navigation**: Allows users to cycle through other matches without losing context.
- **Responsive Design**:
  - **Mobile-First**: Stacked layout for small screens.
  - **Tablet/Desktop Optimization**: Adaptive "Split View" layout for the Results card to utilize wider screens effectively.
- **PWA Ready**:
  - **Installable**: Can be installed on mobile/desktop as a native-like app.
  - **Offline Support**: Caches assets and API responses to work without an internet connection.
- **Interactive Feedback**:
  - **Vote & Save**: "Like/Dislike" buttons saved to `localStorage`.
  - **History Tracking**: View your history of saved recipes with **direct external links** to the source.

## Tech Stack 🛠️

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (with `lucide-react` icons)
- **API**: [TheMealDB](https://www.themealdb.com/api.php)
- **Tooling**:
  - **Vitest**: Unit & Integration Testing
  - **Storybook**: Component Documentation & Visual Testing
  - **VitePWA**: Progressive Web App generation

## Setup Instructions 🚀

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will start at `http://localhost:5173`.

4.  **Storybook (Component Library)**:
    Visualize and test components in isolation:
    ```bash
    npm run storybook
    ```
    Opens interactive UI at `http://localhost:6006`.

5.  **Run Tests**:
    - **All Tests** (Unit + Storybook Interactions):
      ```bash
      npm test
      ```
    - **Only Storybook Tests**:
      ```bash
      npx vitest --project=storybook
      ```

6.  **Test PWA (Offline Mode)**:
    Service Workers work best in production builds.
    ```bash
    npm run build
    npm run preview
    ```
    Toggle "Offline" in DevTools or disconnect Wi-Fi to test.

## Design Decisions 🎨

- **Single-Source of Truth (URL)**: Moved state to URL Params for shareability and history navigation.
- **Storybook-First Development**: All UI components (`StepOne`, `Results`) are documented and visually tested in Storybook to ensure robustness before integration.
- **Optimized API Strategy**: Two-phase fetching (List -> Details) with extensive caching logic to ensure speed and offline capability.
- **Visual Polish**:
  - **Split View Layout**: On larger screens, the results card expands to show the image and details side-by-side.
  - **Micro-animations**: Entry animations and smooth transitions for a premium feel.

## Project Structure 📂

- `src/components`: UI Components
- `.storybook`: Storybook configuration
- `src/hooks`: Custom hooks (useHistory)
- `src/services`: API integration layer
- `src/pages`: Main page views
- `src/types`: TypeScript interfaces
- `src/tests`: Unit tests (Logic) & Stories (Visual Interactions)
