export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600",
    outline:
      "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-50 border border-transparent focus:ring-blue-500",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
