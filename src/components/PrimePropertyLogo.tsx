/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface PrimePropertyLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function PrimePropertyLogo({ className = "h-10", iconOnly = false }: PrimePropertyLogoProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Icon portion of the logo */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Shape: Gold Chevron Wing (parallels slant/isometrics) */}
        <path
          d="M17 56 L44 26 V76 H35 V43 L17 66 V56 Z"
          fill="url(#goldLogoGrad)"
        />
        
        {/* Middle Shape: Crimson Red Pillar (vertical, pointed angled caps) */}
        <path
          d="M48 22 L55 14 V80 L48 88 Z"
          fill="url(#redLogoGrad)"
        />
        
        {/* Right Shape: Black/White Stylized "P" with hollow loop */}
        <path
          d="M59 26 V88 H66 V64 H79 L89 52 L79 40 H66 V26 Z M66 47 H76 L80 52 L76 57 H66 V47 Z"
          fillRule="evenodd"
          className="fill-white"
          fill="currentColor"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="goldLogoGrad" x1="17" y1="26" x2="44" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E5C158" />
            <stop offset="50%" stopColor="#C9A961" />
            <stop offset="100%" stopColor="#96701B" />
          </linearGradient>
          <linearGradient id="redLogoGrad" x1="48" y1="14" x2="55" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text portion of the logo */}
      {!iconOnly && (
        <div className="flex flex-col text-left justify-center">
          <span className="text-xl font-bold tracking-[0.22em] text-white font-sans leading-none">
            PRIME
          </span>
          <div className="flex items-center gap-1 mt-1.5">
            <div className="h-[1px] w-2.5 bg-luxury-gold/30" />
            <span className="text-[8px] tracking-[0.38em] text-gray-400 font-bold uppercase font-sans">
              PROPERTY
            </span>
            <div className="h-[1px] w-2.5 bg-luxury-gold/30" />
          </div>
        </div>
      )}
    </div>
  );
}
