import { useSearchParams, Navigate } from "react-router-dom";
import ContentDetailPage from "./ContentDetailPage.tsx";

export default function DetailPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return <Navigate to="/" replace />;

  return <ContentDetailPage overrideContentId={id} />;
}
