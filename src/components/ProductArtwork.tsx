import { CategoryId, ProductVisualKind } from '../types/store';

interface ProductArtworkProps {
  kind: ProductVisualKind;
  category: Exclude<CategoryId, 'semua'>;
  unit: string;
  compact?: boolean;
}

const CATEGORY_SURFACE: Record<
  Exclude<CategoryId, 'semua'>,
  { bg: string; accent: string; secondary: string; labelLine: string }
> = {
  'kebutuhan-pokok': {
    bg: 'bg-[#F5F3EC]',
    accent: '#005A2B',
    secondary: '#C9B99B',
    labelLine: '#DCD7C9',
  },
  'makanan-minuman': {
    bg: 'bg-[#F3F5F1]',
    accent: '#005A2B',
    secondary: '#A5B8A8',
    labelLine: '#D8E0D8',
  },
  'rumah-tangga': {
    bg: 'bg-[#F1F4F5]',
    accent: '#2B5B6C',
    secondary: '#9EB7C0',
    labelLine: '#D6E0E4',
  },
  'perawatan-pribadi': {
    bg: 'bg-[#F5F2F0]',
    accent: '#5B564D',
    secondary: '#B9AEA4',
    labelLine: '#E2DDD7',
  },
  'umkm-lokal': {
    bg: 'bg-[#FAF3EA]',
    accent: '#D96F06',
    secondary: '#C89B6E',
    labelLine: '#EAD9C4',
  },
  'produk-praktis': {
    bg: 'bg-[#F4F5F0]',
    accent: '#005A2B',
    secondary: '#F5820D',
    labelLine: '#DFE2D7',
  },
};

export function ProductArtwork({
  kind,
  category,
  unit,
  compact = false,
}: ProductArtworkProps) {
  const palette = CATEGORY_SURFACE[category];

  return (
    <div
      className={`relative w-full overflow-hidden ${palette.bg} flex items-center justify-center select-none ${
        compact ? 'h-full rounded-md' : 'aspect-[4/3]'
      }`}
    >
      {/* Subtle shelf hairline */}
      {!compact && (
        <div
          className="absolute inset-x-5 bottom-4 h-px opacity-70"
          style={{ backgroundColor: palette.labelLine }}
          aria-hidden="true"
        />
      )}

      {/* Minimalist packaging silhouette */}
      <svg
        viewBox="0 0 120 96"
        className={compact ? 'w-11 h-11' : 'w-[74%] h-[74%]'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderPackagingSvg(kind, palette.accent, palette.secondary)}
      </svg>

      {/* Net weight corner stamp */}
      {!compact && (
        <span className="absolute bottom-2.5 right-3 text-[11px] font-medium tracking-tight text-[#666660] tabular-nums">
          {unit}
        </span>
      )}
    </div>
  );
}

function renderPackagingSvg(
  kind: ProductVisualKind,
  accent: string,
  secondary: string
) {
  switch (kind) {
    case 'rice':
      return (
        <>
          <rect
            x="31"
            y="14"
            width="58"
            height="68"
            rx="7"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path d="M35 21H85" stroke="#E5E4DF" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="31" y="34" width="58" height="22" fill={accent} />
          <circle cx="60" cy="45" r="5" fill="#FAF9F6" />
          <path d="M46 66H74" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 72H68" stroke="#D1CFC7" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );

    case 'oil':
      return (
        <>
          <path
            d="M46 14H74L79 25L83 78C83 80.5 81 82 78.5 82H41.5C39 82 37 80.5 37 78L41 25L46 14Z"
            fill="#FFF7DF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="52" y="10" width="16" height="5" rx="1.5" fill={accent} />
          <path d="M43 44H77V64H43V44Z" fill="#FFFFFF" stroke="#E5E4DF" strokeWidth="1.2" />
          <path
            d="M60 48C60 48 65 54 65 57.5C65 60.2 62.8 62 60 62C57.2 62 55 60.2 55 57.5C55 54 60 48 60 48Z"
            fill="#F5820D"
          />
        </>
      );

    case 'sugar':
      return (
        <>
          <rect
            x="34"
            y="18"
            width="52"
            height="64"
            rx="5"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="34" y="18" width="52" height="14" rx="4" fill={accent} />
          <rect x="44" y="42" width="32" height="24" rx="2" fill="#FAF9F6" stroke="#E5E4DF" />
          <path d="M51 54H69" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M54 60H66" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
        </>
      );

    case 'eggs':
      return (
        <>
          <rect
            x="22"
            y="44"
            width="76"
            height="34"
            rx="4"
            fill="#EAE3D2"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <ellipse cx="38" cy="43" rx="9" ry="12" fill="#E6C29F" stroke="#1A1A1A" strokeWidth="1.4" />
          <ellipse cx="60" cy="41" rx="9.5" ry="13" fill="#DDB28A" stroke="#1A1A1A" strokeWidth="1.4" />
          <ellipse cx="82" cy="43" rx="9" ry="12" fill="#E6C29F" stroke="#1A1A1A" strokeWidth="1.4" />
          <rect x="22" y="54" width="76" height="24" rx="3" fill="#F4EFE4" stroke="#1A1A1A" strokeWidth="1.5" />
          <path d="M46 66H74" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'noodle':
      return (
        <>
          <rect
            x="24"
            y="24"
            width="72"
            height="52"
            rx="4"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="24" y="24" width="16" height="52" rx="3" fill={accent} />
          <path
            d="M50 43C54 39 58 47 62 43C66 39 70 47 74 43C78 39 82 47 86 43"
            stroke="#F5820D"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M50 51C54 47 58 55 62 51C66 47 70 55 74 51C78 47 82 55 86 51"
            stroke="#F5820D"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M50 63H78" stroke="#D1CFC7" strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'water':
      return (
        <>
          <rect x="52" y="10" width="16" height="7" rx="2" fill={accent} />
          <path
            d="M53 17H67L74 30V78C74 80.2 72.2 82 70 82H50C47.8 82 46 80.2 46 78V30L53 17Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="46" y="42" width="28" height="20" fill="#E8F1EE" stroke="#C5DAD2" strokeWidth="1" />
          <path d="M51 52C55 49 65 55 69 52" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'iced-coffee':
      return (
        <>
          <path
            d="M42 26H78L73 80C72.8 81.2 71.8 82 70.6 82H49.4C48.2 82 47.2 81.2 47 80L42 26Z"
            fill="#EFE3D5"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path d="M39 26H81" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 26C44 17 51 12 60 12C69 12 76 17 76 26" stroke="#1A1A1A" strokeWidth="1.4" />
          <path d="M64 8L58 34" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="45" y="46" width="30" height="18" rx="2" fill="#FFFFFF" stroke="#E5E4DF" />
          <circle cx="60" cy="55" r="4" fill="#6F4E37" />
        </>
      );

    case 'tea':
      return (
        <>
          <rect x="53" y="11" width="14" height="6" rx="1.5" fill="#F5820D" />
          <path
            d="M54 17H66L74 31V78C74 80.2 72.2 82 70 82H50C47.8 82 46 80.2 46 78V31L54 17Z"
            fill="#F4E6C8"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="46" y="40" width="28" height="22" fill="#FFFFFF" stroke="#E5E4DF" />
          <path
            d="M54 55C55 48 61 45 66 47C65 53 60 57 54 55Z"
            fill={accent}
          />
        </>
      );

    case 'bread':
      return (
        <>
          <rect
            x="28"
            y="24"
            width="64"
            height="56"
            rx="10"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path
            d="M38 56C38 41 47 34 60 34C73 34 82 41 82 56V70H38V56Z"
            fill="#E8C69A"
            stroke="#1A1A1A"
            strokeWidth="1.4"
          />
          <path d="M48 44L53 50M60 42L64 49M71 45L74 51" stroke="#8C5A2B" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="47" y="18" width="26" height="6" rx="2" fill={accent} />
        </>
      );

    case 'onigiri':
      return (
        <>
          <path
            d="M60 16C64 16 68 20 74 31L89 62C93 70 88 78 79 78H41C32 78 27 70 31 62L46 31C52 20 56 16 60 16Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path
            d="M46 53H74L80 78H40L46 53Z"
            fill="#1F2E24"
          />
          <rect x="55" y="16" width="10" height="14" rx="2" fill="#F5820D" />
          <circle cx="60" cy="40" r="2.2" fill="#1A1A1A" />
          <circle cx="53" cy="45" r="1.5" fill="#666660" />
          <circle cx="67" cy="45" r="1.5" fill="#666660" />
        </>
      );

    case 'cold-brew':
      return (
        <>
          <rect x="52" y="12" width="16" height="7" rx="1.5" fill="#1A1A1A" />
          <rect
            x="43"
            y="19"
            width="34"
            height="63"
            rx="6"
            fill="#3B2B23"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="43" y="38" width="34" height="26" fill="#FAF9F6" />
          <path d="M51 48H69" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M51 55H64" stroke="#F5820D" strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'detergent':
      return (
        <>
          <rect x="46" y="12" width="16" height="7" rx="2" fill={accent} />
          <path
            d="M43 19H72C77 19 81 23 81 28V76C81 79.3 78.3 82 75 82H43C39.7 82 37 79.3 37 76V27C37 22.5 39.7 19 43 19Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="65" y="29" width="8" height="22" rx="4" fill="#F1F4F5" stroke="#1A1A1A" strokeWidth="1.3" />
          <rect x="43" y="42" width="18" height="26" rx="2" fill={accent} />
          <circle cx="52" cy="55" r="4" fill="#FFFFFF" />
        </>
      );

    case 'dish-soap':
      return (
        <>
          <path d="M55 12H65L63 20H57L55 12Z" fill="#005A2B" />
          <path
            d="M48 20H72L78 44V76C78 79.3 75.3 82 72 82H48C44.7 82 42 79.3 42 76V44L48 20Z"
            fill="#E3F2E8"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="47" y="42" width="26" height="24" rx="3" fill="#FFFFFF" stroke="#C5DFCE" />
          <circle cx="60" cy="54" r="6" fill="#005A2B" />
          <path d="M60 48V54H66" stroke="#FFFFFF" strokeWidth="1.4" />
        </>
      );

    case 'tissue':
      return (
        <>
          <path
            d="M46 38C48 22 57 18 61 28C65 18 74 22 76 38"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.4"
          />
          <rect
            x="24"
            y="38"
            width="72"
            height="42"
            rx="5"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="24" y="64" width="72" height="16" rx="3" fill={accent} />
          <path d="M44 48H76" stroke="#D1CFC7" strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'body-wash':
      return (
        <>
          <path
            d="M40 20H80L84 78C84 80.2 82.2 82 80 82H40C37.8 82 36 80.2 36 78L40 20Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path d="M48 13H62L65 20H45L48 13Z" fill={secondary} stroke="#1A1A1A" strokeWidth="1.3" />
          <circle cx="60" cy="50" r="11" fill="#F2ECE6" stroke={accent} strokeWidth="1.4" />
          <path d="M55 50H65" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );

    case 'shampoo':
      return (
        <>
          <path d="M56 12H71M60 12V22" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
          <rect
            x="43"
            y="22"
            width="34"
            height="60"
            rx="7"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="43" y="42" width="34" height="22" fill="#EAE6E1" />
          <path d="M51 50H69" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          <path d="M54 56H66" stroke="#8C857D" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );

    case 'toothpaste':
      return (
        <>
          <rect
            x="22"
            y="34"
            width="76"
            height="32"
            rx="4"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="22" y="34" width="22" height="32" rx="3" fill="#005A2B" />
          <path d="M52 46H86" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M52 54H74" stroke="#9EB7C0" strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'gayo-coffee':
      return (
        <>
          <path
            d="M35 16H85L88 76C88 79.3 85.3 82 82 82H38C34.7 82 32 79.3 32 76L35 16Z"
            fill="#DFC7A9"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <path d="M35 23H85" stroke="#8E6F4E" strokeWidth="1.4" />
          <rect x="40" y="34" width="40" height="34" rx="2" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.2" />
          <rect x="40" y="34" width="40" height="10" fill="#005A2B" />
          <circle cx="60" cy="56" r="5" fill="#F5820D" />
          <path d="M58 51C61 54 61 58 58 61" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
        </>
      );

    case 'chips':
      return (
        <>
          <rect
            x="33"
            y="16"
            width="54"
            height="66"
            rx="6"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="33" y="16" width="54" height="12" rx="4" fill="#F5820D" />
          <circle cx="53" cy="52" r="9" fill="#F3D49B" stroke="#1A1A1A" strokeWidth="1.3" />
          <circle cx="67" cy="56" r="8" fill="#E8BE74" stroke="#1A1A1A" strokeWidth="1.3" />
          <path d="M44 72H76" stroke={secondary} strokeWidth="2" strokeLinecap="round" />
        </>
      );

    case 'pastry':
      return (
        <>
          <rect
            x="24"
            y="30"
            width="72"
            height="48"
            rx="5"
            fill="#F4E8D6"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="34" y="38" width="52" height="24" rx="3" fill="#FFFFFF" stroke="#D5C2A8" />
          <circle cx="48" cy="50" r="6" fill="#D99B58" stroke="#1A1A1A" strokeWidth="1.2" />
          <circle cx="60" cy="50" r="6" fill="#E3AE72" stroke="#1A1A1A" strokeWidth="1.2" />
          <circle cx="72" cy="50" r="6" fill="#D99B58" stroke="#1A1A1A" strokeWidth="1.2" />
          <rect x="46" y="68" width="28" height="4" rx="2" fill="#F5820D" />
        </>
      );

    case 'honey':
      return (
        <>
          <rect x="46" y="14" width="28" height="9" rx="2" fill="#1A1A1A" />
          <rect
            x="40"
            y="23"
            width="40"
            height="59"
            rx="8"
            fill="#E8A236"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <rect x="40" y="42" width="40" height="22" fill="#FFFFFF" />
          <path d="M51 50H69" stroke="#005A2B" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 56H66" stroke="#F5820D" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
  }
}
