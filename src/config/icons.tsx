export const PlanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`h-5 w-5 ${className || 'text-foreground'}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 7C21 9.20914 16.9706 11 12 11C7.02944 11 3 9.20914 3 7M21 7C21 4.79086 16.9706 3 12 3C7.02944 3 3 4.79086 3 7M21 7V12M3 7V12M12 16C7.02944 16 3 14.2091 3 12M3 12V17C3 19.2091 7.02944 21 12 21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M18 15V18M18 21V18M18 18H21M18 18H15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
