# Recipe Recommender App 🥘

A React application that helps users find recipe ideas based on their preferences (Cuisine and Ingredient).
Built as a solution for the "Two-Step Recommender" developer exercise.

## Features ✨

- **Two-Step Wizard**: 
  - **Step 1**: Choose a Cuisine (Area) from dynamic options.
  - **Step 2**: Search for a Main Ingredient with real-time filtering.
- **Smart Recommendation**:
  - Displays a **single** recipe match at a time.
  - **"New Idea"** button to cycle through other recipes matching the same criteria.
  - **Vote & Save**: Users can "Like" or "Dislike" recommendations. Interactive feedback is saved locally.
- **History Tracking**:
  - All saved interactions are persisted in `localStorage`.
  - View your history of liked/disliked recipes in the History tab.
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

- **Single Card View**: Instead of overwhelming the user with a list, we present one recipe at a time ("Tinder for Food" style) to focus attention and simplify the decision process.
- **Client-Side Filtering**: Since TheMealDB API has limitations on complex queries, we fetch recipes by Area and Ingredient in parallel (`Promise.all`) and compute the intersection on the client side for accurate results.
- **Zero-Layout-Shift**: Used `h-screen` and `overflow-hidden` container strategies to prevent the whole page from scrolling, keeping navigation bars fixed and providing a native-app-like feel on mobile.
- **Accessibility**: Semantic HTML tags, clear button labeling, and keyboard-friendly navigation.

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
