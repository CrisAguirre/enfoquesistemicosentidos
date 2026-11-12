export default function InfoPanel({ title = 'ℹ️ Información', children }) {
  return (
    <div className="info-panel">
      <div className="info-panel-title">{title}</div>
      <div className="info-panel-body">{children}</div>
    </div>
  );
}
