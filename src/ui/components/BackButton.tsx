export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" className="back-button" onClick={onBack}>
      ← Volver
    </button>
  )
}
