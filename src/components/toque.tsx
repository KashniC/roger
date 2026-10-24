/** Roger's toque mark. Drawn on a 32 grid; stroke follows the text weight it sits beside. */
export function Toque({ className = "size-6", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 19.5C5.9 19 4 16.6 4 13.8 4 10.6 6.6 8 9.8 8c.5 0 1 .1 1.5.2C12.3 5.7 14 4 16 4s3.7 1.7 4.7 4.2c.5-.1 1-.2 1.5-.2C25.4 8 28 10.6 28 13.8c0 2.8-1.9 5.2-5 5.7" />
      <path d="M9 19.5V27h14v-7.5" />
      <path d="M9 23.5h14" />
      <path d="M12.5 15.5v4M16 14.5v5M19.5 15.5v4" />
    </svg>
  );
}
