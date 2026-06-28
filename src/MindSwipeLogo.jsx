export default function MindSwipeLogo({ className = '' }) {
  return (
    <svg className={className} viewBox='0 0 64 64' role='img' aria-label='MindSwipe logo'>
      <defs>
        <linearGradient id='ms-gold-mark' x1='12' y1='8' x2='52' y2='58' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#fff3cf' />
          <stop offset='0.45' stopColor='#d8ad57' />
          <stop offset='1' stopColor='#7d5021' />
        </linearGradient>
        <radialGradient id='ms-ruby-mark' cx='50%' cy='38%' r='62%'>
          <stop stopColor='#551017' />
          <stop offset='0.62' stopColor='#16090a' />
          <stop offset='1' stopColor='#050505' />
        </radialGradient>
        <filter id='ms-lux-glow' x='-40%' y='-40%' width='180%' height='180%'>
          <feGaussianBlur stdDeviation='1.6' result='blur' />
          <feColorMatrix in='blur' type='matrix' values='1 0 0 0 0.86 0 1 0 0 0.57 0 0 1 0 0.2 0 0 0 0.7 0' result='glow' />
          <feMerge>
            <feMergeNode in='glow' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <rect x='6' y='6' width='52' height='52' rx='18' fill='url(#ms-ruby-mark)' />
      <rect x='7.5' y='7.5' width='49' height='49' rx='16.5' fill='none' stroke='url(#ms-gold-mark)' strokeWidth='2' />
      <path d='M18 43V21l14 16 14-16v22' fill='none' stroke='url(#ms-gold-mark)' strokeWidth='4.2' strokeLinecap='round' strokeLinejoin='round' filter='url(#ms-lux-glow)' />
      <path d='M24 21h16M32 14v31' fill='none' stroke='#fff3cf' strokeOpacity='0.72' strokeWidth='2.2' strokeLinecap='round' />
      <path d='M18 48h28' fill='none' stroke='url(#ms-gold-mark)' strokeWidth='2.4' strokeLinecap='round' />
      <circle cx='32' cy='32' r='3.2' fill='#d8ad57' />
    </svg>
  );
}
