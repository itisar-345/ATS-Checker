import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "1rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#fee2e2",
              padding: "1.5rem",
              borderRadius: "9999px",
            }}
          >
            <FileX style={{ height: "48px", width: "48px", color: "#dc2626" }} />
          </div>
        </div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "0.5rem", color: "#111827" }}>
          404
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#4b5563", marginBottom: "1.5rem" }}>
          Oops! Page not found
        </p>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
