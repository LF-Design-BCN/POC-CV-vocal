"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: "8px 16px",
        border: "1px solid #2C2C2A",
        background: "white",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      Imprimer / exporter en PDF
    </button>
  );
}
