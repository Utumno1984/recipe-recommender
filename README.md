# Recipe Recommender App 🥘

A React application that helps users find recipe ideas based on their preferences (Cuisine and Ingredient).
Built as a solution for the "Two-Step Recommender" developer exercise.

## Features ✨

- **Two-Step Wizard**:
  - **Step 1**: Choose a Cuisine (Area) from dynamic options.
  - **Step 2**: Search for a Main Ingredient with real-time filtering.
- **Smart Recommendation Engine**:
  - **Single-View UI**: Displays one curated recipe at a time to reduce decision paralysis.
  - **"New Idea" Navigation**: Allows users to cycle through other matches if the current one doesn't inspire them.
  - **Ingredient Insights**: Interactive info overlay to view details about the selected main ingredient.
- **Interactive Feedback**:
  - **Vote & Save**: Users can provide immediate "Yes/No" feedback.
  - **Visual Confirmation**: The UI updates instantly upon voting to prevent duplicate interactions.
- **History Tracking**:
  - All interactions (Matches & Rejections) are persisted in `localStorage` with timestamps and search criteria.
  - View your history of approved/discarded recipes in the History tab.
- **Responsive Design**: Mobile-first UI using Tailwind CSS.

## Tech Stack 🛠️

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **API**: [TheMealDB](https://www.themealdb.com/api.php) (Free, No Auth)
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext` pattern via custom hooks)
- **Testing**: Vitest + React Testing Library

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
4.  **Run Tests**:
    ```bash
    npm test
    ```

## Design Decisions 🎨

- **Sequential Discovery (Single Card UI)**: Instead of overwhelming the user with a grid of results, I implemented a single-card view. This focuses the user's attention on one option at a time, simplifying the decision-making process (similar to modern discovery apps).
- **Client-Side Intersection Logic**: Since TheMealDB API limits complex queries (no direct filtering by Area AND Ingredient), I fetch both datasets in parallel using `Promise.all` and perform a high-performance intersection on the client side.
- **Immediate Feedback Loop**: The "Like/Dislike" buttons are integrated directly into the discovery card. Once voted, the card state changes to provide visual confirmation, ensuring a smooth UX without page reloads.
- **Zero-Layout-Shift**: Used `overflow-hidden` strategies and absolute positioning for overlays (like the ingredient description) to keep the experience app-like and stable on mobile devices.

## Project Structure 📂

- `src/components`: UI Components (StepOne, StepTwo, Results, Navbar)
- `src/hooks`: Custom hooks (useHistory for localStorage logic)
- `src/services`: API integration layer
- `src/pages`: Main page views (SearchPage, HistoryPage)
- `src/types`: TypeScript interfaces

## Future Improvements 🔮

- [ ] Shareable URLs with query parameters.
- [ ] Offline mode support.
- [ ] More advanced filtering (Time, Difficulty).
