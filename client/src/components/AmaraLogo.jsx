export default function AmaraLogo({ size = 58 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="amaraGlow" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0%" stopColor="#00B7FF" />
          <stop offset="100%" stopColor="#00FF99" />
        </linearGradient>

        <linearGradient id="amaraSoft" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(180,255,245,0.9)" />
        </linearGradient>

        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="url(#amaraGlow)"
        strokeWidth="3"
        fill="rgba(8,20,35,0.92)"
      />

      <path
        d="M35 42L28 25L46 35"
        stroke="url(#amaraGlow)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(0,183,255,0.08)"
        filter="url(#glow)"
      />

      <path
        d="M85 42L92 25L74 35"
        stroke="url(#amaraGlow)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(0,255,153,0.08)"
        filter="url(#glow)"
      />

      <path
        d="M30 58C30 41 43 30 60 30C77 30 90 41 90 58C90 76 77 90 60 90C43 90 30 76 30 58Z"
        stroke="url(#amaraGlow)"
        strokeWidth="4"
        fill="rgba(10,24,40,0.95)"
      />

      <path
        d="M60 22
           C72 24 83 31 89 42
           C95 54 95 68 89 79
           C82 92 70 99 60 101
           C50 99 38 92 31 79
           C25 68 25 54 31 42
           C37 31 48 24 60 22Z"
        stroke="url(#amaraGlow)"
        strokeWidth="2.5"
        fill="none"
        opacity="0.95"
      />

      <path
        d="M44 56C47 52 51 50 55 50C58 50 60 52 60 55C60 52 62 50 65 50C69 50 73 52 76 56"
        stroke="url(#amaraSoft)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <circle cx="49" cy="55" r="3.5" fill="#DFFFF8" />
      <circle cx="71" cy="55" r="3.5" fill="#DFFFF8" />

      <path
        d="M54 67C56 64 58 63 60 63C62 63 64 64 66 67"
        stroke="url(#amaraGlow)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M60 63L60 71"
        stroke="url(#amaraGlow)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M47 69L34 66"
        stroke="url(#amaraGlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M47 73L33 73"
        stroke="url(#amaraGlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M73 69L86 66"
        stroke="url(#amaraGlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M73 73L87 73"
        stroke="url(#amaraGlow)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      <path
        d="M40 92C47 85 53 82 60 82C67 82 73 85 80 92"
        stroke="url(#amaraGlow)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}