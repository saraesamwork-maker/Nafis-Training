import type { HeroId } from '../types/game';

interface SpriteProps {
  className?: string;
}

export function KittyHeroSprite({ className = 'w-10 h-10' }: SpriteProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="سُكّر المستكشفة" role="img">
      {/* Ears */}
      <path d="M16 24 L13 8 L28 16 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 24 L51 8 L36 16 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M17.5 21 L16 12.5 L24 17 Z" fill="#fbcfe8" />
      <path d="M46.5 21 L48 12.5 L40 17 Z" fill="#fbcfe8" />
      {/* Head */}
      <ellipse cx="32" cy="34" rx="22" ry="18" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
      {/* Pink Ribbon Bow */}
      <circle cx="44" cy="18" r="4" fill="#ec4899" stroke="#1e293b" strokeWidth="2" />
      <path d="M40 16 L33 12 L34 21 Z" fill="#f472b6" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M48 16 L55 12 L54 21 Z" fill="#f472b6" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
      {/* Eyes & Nose */}
      <ellipse cx="23" cy="34" rx="2.4" ry="3.2" fill="#0f172a" />
      <ellipse cx="41" cy="34" rx="2.4" ry="3.2" fill="#0f172a" />
      <circle cx="22.3" cy="32.8" r="0.9" fill="#ffffff" />
      <circle cx="40.3" cy="32.8" r="0.9" fill="#ffffff" />
      <ellipse cx="32" cy="38.5" rx="3" ry="2" fill="#fbbf24" stroke="#1e293b" strokeWidth="1.5" />
      {/* Cheeks */}
      <ellipse cx="18" cy="40" rx="3.2" ry="1.8" fill="#fbcfe8" />
      <ellipse cx="46" cy="40" rx="3.2" ry="1.8" fill="#fbcfe8" />
      {/* Whiskers */}
      <line x1="7" y1="33" x2="15" y2="34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="38" x2="14" y2="38" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="49" y1="34" x2="57" y2="33" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="38" x2="58" y2="38" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Explorer Scarf */}
      <path d="M20 49 Q32 55 44 49 L41 56 Q32 59 23 56 Z" fill="#ec4899" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function BunnyHeroSprite({ className = 'w-10 h-10' }: SpriteProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="لوز المغامرة" role="img">
      {/* Long Bunny Ears with Pink Hood */}
      <path d="M18 26 C11 10, 18 4, 24 12 C27 16, 27 22, 26 26 Z" fill="#f472b6" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M46 26 C53 10, 46 4, 40 12 C37 16, 37 22, 38 26 Z" fill="#f472b6" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Hood */}
      <ellipse cx="32" cy="36" rx="22" ry="19" fill="#f472b6" stroke="#1e293b" strokeWidth="2.5" />
      {/* Inner Face */}
      <ellipse cx="32" cy="38" rx="16" ry="13.5" fill="#fffbeb" stroke="#1e293b" strokeWidth="2" />
      {/* Star Pin */}
      <polygon
        points="20,21 21.8,24.6 25.8,25.2 22.9,28 23.6,32 20,30.1 16.4,32 17.1,28 14.2,25.2 18.2,24.6"
        fill="#fbbf24"
        stroke="#1e293b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Eyes & Smile */}
      <ellipse cx="25" cy="37" rx="2.3" ry="3" fill="#0f172a" />
      <ellipse cx="39" cy="37" rx="2.3" ry="3" fill="#0f172a" />
      <circle cx="24.3" cy="35.8" r="0.9" fill="#ffffff" />
      <circle cx="38.3" cy="35.8" r="0.9" fill="#ffffff" />
      <ellipse cx="32" cy="41.5" rx="2.2" ry="1.6" fill="#fb7185" />
      <path d="M29.5 44.5 Q32 47 34.5 44.5" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cheeks */}
      <ellipse cx="20.5" cy="42" rx="2.8" ry="1.6" fill="#fecdd3" />
      <ellipse cx="43.5" cy="42" rx="2.8" ry="1.6" fill="#fecdd3" />
    </svg>
  );
}

export function MonsterSprite({ className = 'w-10 h-10' }: SpriteProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="وحش المتاهة" role="img">
      {/* Horns */}
      <path d="M18 20 L12 8 L25 14 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M46 20 L52 8 L39 14 Z" fill="#fbbf24" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Body */}
      <path
        d="M12 36 C12 20, 20 14, 32 14 C44 14, 52 20, 52 36 C52 49, 44 54, 32 54 C20 54, 12 49, 12 36 Z"
        fill="#e11d48"
        stroke="#1e293b"
        strokeWidth="2.5"
      />
      {/* Inner Belly Highlight */}
      <ellipse cx="32" cy="45" rx="12" ry="6" fill="#fb7185" opacity="0.65" />
      {/* Expressive Eyes */}
      <circle cx="24" cy="30" r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
      <circle cx="40" cy="30" r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
      <circle cx="25" cy="30" r="2.6" fill="#0f172a" />
      <circle cx="39" cy="30" r="2.6" fill="#0f172a" />
      {/* Angry-playful Eyebrows */}
      <line x1="18" y1="22" x2="28" y2="25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="22" x2="36" y2="25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth & Fangs */}
      <path d="M22 41 Q32 47 42 41" fill="#881337" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <polygon points="25,41 27,45 29,41" fill="#ffffff" />
      <polygon points="35,41 37,45 39,41" fill="#ffffff" />
    </svg>
  );
}

export function HeroSprite({ heroId, className }: { heroId: HeroId; className?: string }) {
  return heroId === 'kitty' ? (
    <KittyHeroSprite className={className} />
  ) : (
    <BunnyHeroSprite className={className} />
  );
}
