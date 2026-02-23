import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ContentDetailPage from "./pages/ContentDetailPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:rubricId" element={<CategoryPage />} />
        <Route path="/content/:contentId" element={<ContentDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}
