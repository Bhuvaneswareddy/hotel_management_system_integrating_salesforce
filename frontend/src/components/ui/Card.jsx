export function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-xl bg-white border border-gray-200 shadow-sm p-4 " + className
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
