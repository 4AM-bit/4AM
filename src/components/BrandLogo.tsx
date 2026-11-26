import { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

const LOGO_SRC = '/assets/aistudio/Modern_4AM_Shopping_Cart_Logo_e87e3718.png';

export function BrandLogo({
  className = 'h-9 md:h-11 w-auto object-contain',
  alt = '4 AM Minimarket',
}: BrandLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <svg
        viewBox="0 0 260 92"
        className={className}
        role="img"
        aria-label={alt}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Two orange motion lines on the left */}
        <rect x="6" y="28" width="34" height="9" rx="4.5" fill="#F5820D" />
        <rect x="16" y="42" width="28" height="9" rx="4.5" fill="#F5820D" />

        {/* Green shopping cart handle, basket frame, and base */}
        <path
          d="M28 16H49C53 16 56 19 57.5 23L69 57C70.5 61 74 64 78.5 64H147L140 73H77C68 73 61 67 58 59L46 25H28C24.5 25 22 22.5 22 19.5C22 17.5 24.5 16 28 16Z"
          fill="#005A2B"
        />
        <path d="M51 27H92L86 35H54L51 27Z" fill="#005A2B" />

        {/* Cart wheels */}
        <circle cx="84" cy="82" r="8" fill="#005A2B" />
        <circle cx="122" cy="82" r="8" fill="#005A2B" />

        {/* Bold integrated "4" */}
        <path
          d="M99 18H116L107 58H93L99 31L75 53C72 56 67 55 66 51C65 48 67 45 69 43L99 18Z"
          fill="#005A2B"
        />

        {/* Orange curved crossbar swoosh */}
        <path
          d="M68 59C81 45 102 41 124 41L117 53C99 52 82 54 68 59Z"
          fill="#F5820D"
        />

        {/* Bold italic-leaning "AM" wordmark */}
        <path
          d="M142 22H157L168 62H153L151 54H136L132 62H118L142 22ZM148 43L145 33L140 43H148Z"
          fill="#005A2B"
        />
        <path
          d="M174 22H190L198 44L214 22H230L221 62H208L213 39L199 57H190L184 39L179 62H166L174 22Z"
          fill="#005A2B"
        />
      </svg>
    );
  }

  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`${className} mix-blend-multiply select-none`}
    />
  );
}
