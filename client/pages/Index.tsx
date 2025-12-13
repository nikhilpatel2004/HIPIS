import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // This page is not used - redirect to home which shows Landing
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
