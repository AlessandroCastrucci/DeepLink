import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ContentDetailPage from "./pages/ContentDetailPage.tsx";
import DetailPage from "./pages/DetailPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import TVLoginPage from "./pages/TVLoginPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<HomePage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/category/:rubricId" element={<CategoryPage />} />
        <Route path="/content/:contentId" element={<ContentDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route path="/tv-login" element={<TVLoginPage />} />
    </Routes>
  );
}
