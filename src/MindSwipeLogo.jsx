export default function MindSwipeLogo({ className = '' }) {
  return (
    <svg className={className} viewBox='0 0 64 64' role='img' aria-label='MindSwipe logo'>
      <defs>
        <linearGradient id='ms-card' x1='9' y1='6' x2='56' y2='60' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#f8f7f2' stopOpacity='0.92' />
          <stop offset='0.44' stopColor='#72dccd' stopOpacity='0.76' />
          <stop offset='1' stopColor='#171b22' />
        </linearGradient>
        <linearGradient id='ms-flame' x1='28' y1='13' x2='39' y2='52' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#fff1b8' />
          <stop offset='0.44' stopColor='#f2c14e' />
          <stop offset='1' stopColor='#f06f3f' />
        </linearGradient>
        <filter id='ms-glow' x='-40%' y='-40%' width='180%' height='180%'>
          <feGaussianBlur stdDeviation='2.8' result='blur' />
          <feColorMatrix in='blur' type='matrix' values='1 0 0 0 0.94 0 1 0 0 0.65 0 0 1 0 0.24 0 0 0 0.7 0' result='glow' />
          <feMerge>
            <feMergeNode in='glow' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <rect x='7' y='6' width='50' height='52' rx='16' fill='#10141a' />
      <rect x='8.5' y='7.5' width='47' height='49' rx='14.5' fill='url(#ms-card)' opacity='0.28' />
      <path d='M20 40c6.4-11.3 10.6-20.5 12.4-27.8 8 9 11.8 17.2 11.2 24.7-.5 6.7-5.1 11.9-11.7 13.9 1.5-4.2.6-8.3-2.9-12.4-1.7 4.1-4.7 7.4-9 10 0-2.8.1-5.6 0-8.4Z' fill='url(#ms-flame)' filter='url(#ms-glow)' />
      <path d='M16 31.5c5.4-6 10.7-9 16-9s10.6 3 16 9c-5.4 6-10.7 9-16 9s-10.6-3-16-9Z' fill='#091017' fillOpacity='0.66' stroke='#d9fff7' strokeOpacity='0.72' strokeWidth='2' />
      <circle cx='32' cy='31.5' r='6.5' fill='#72dccd' />
      <circle cx='32' cy='31.5' r='3.1' fill='#0d1117' />
      <path d='M17 16.5 12 12m35 4.5 5-4.5M18 50l-5 4m33-4 5 4' stroke='#fff1b8' strokeOpacity='0.66' strokeWidth='2.2' strokeLinecap='round' />
    </svg>
  );
}
