export default function MindSwipeLogo({ className = '' }) {
  return (
    <svg className={className} viewBox='0 0 64 64' role='img' aria-label='MindSwipe logo'>
      <defs>
        <radialGradient id='ms-orb' cx='34%' cy='24%' r='70%'>
          <stop stopColor='#f4ffff' />
          <stop offset='0.28' stopColor='#9ee8ff' />
          <stop offset='0.62' stopColor='#4e8dff' />
          <stop offset='1' stopColor='#10285f' />
        </radialGradient>
        <linearGradient id='ms-wave' x1='12' y1='24' x2='54' y2='45' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#ffffff' stopOpacity='0.86' />
          <stop offset='0.52' stopColor='#9ee8ff' stopOpacity='0.52' />
          <stop offset='1' stopColor='#ffffff' stopOpacity='0.1' />
        </linearGradient>
        <filter id='ms-orb-glow' x='-45%' y='-45%' width='190%' height='190%'>
          <feGaussianBlur stdDeviation='4.4' result='blur' />
          <feColorMatrix in='blur' type='matrix' values='0 0 0 0 0.24 0 0 0 0 0.72 0 0 0 0 1 0 0 0 0.75 0' result='glow' />
          <feMerge>
            <feMergeNode in='glow' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      <circle cx='32' cy='32' r='25' fill='url(#ms-orb)' filter='url(#ms-orb-glow)' />
      <path d='M13 35c6.5-7.2 12.7-8.4 18.7-3.7 5.8 4.6 12.2 3.5 19.3-3.2-1.6 12.2-8.5 20.3-19 20.3-9.6 0-16.4-5-19-13.4Z' fill='url(#ms-wave)' />
      <path d='M19 18c3.1-3.3 7.4-5.2 12.6-5.2 8.9 0 16.4 6.4 18.1 14.7' fill='none' stroke='#eaffff' strokeOpacity='0.62' strokeWidth='3' strokeLinecap='round' />
      <circle cx='24' cy='20' r='5.2' fill='#ffffff' fillOpacity='0.78' />
      <circle cx='42' cy='42' r='4.1' fill='#101f54' fillOpacity='0.28' />
    </svg>
  );
}
