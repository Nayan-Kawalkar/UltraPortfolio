import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Line({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const STAR = 'M12 2.5c.7 5.6 3.9 8.8 9.5 9.5-5.6.7-8.8 3.9-9.5 9.5-.7-5.6-3.9-8.8-9.5-9.5 5.6-.7 8.8-3.9 9.5-9.5Z';

export const SparkFilled = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2 13.5 10.5 22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5L12 2Z" />
  </svg>
);

export const SparkOutline = (props: IconProps) => (
  <Line {...props}>
    <path d={STAR} />
  </Line>
);

export const FolderIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.4l2 2.2h8.6A1.5 1.5 0 0 1 21 9.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-11Z" />
  </Line>
);

export const ChevronIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="m7 10 5 5 5-5" />
  </Line>
);

export const LinesIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M6 5.5h15M9.5 10h11.5M4 14.5h17M9.5 19h11.5" />
  </Line>
);

export const PhoneIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M2.5 11.2c5.2-5.6 13.8-5.6 19 0l-1.2 2.6-3.8-1V9.9c-3.2-1-5.8-1-9 0v2.9l-3.8 1-1.2-2.6Z" />
    <path d="M6.5 18.5h11M8.4 15.6h7.2l1.9 2.9" />
  </Line>
);

export const XLogo = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.7 3.9H5.8L17.7 20Z" />
  </svg>
);

export const LinkedInIcon = (props: IconProps) => (
  <Line {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M8 10.5v6M8 7.6v.1M12 16.5v-6M12 13c0-1.5 1-2.5 2.2-2.5S16.5 11.4 16.5 13v3.5" />
  </Line>
);

export const MailIcon = (props: IconProps) => (
  <Line {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 7 8.5-7" />
  </Line>
);

export const ArrowUpIcon = (props: IconProps) => (
  <Line strokeWidth="2.2" {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Line>
);

export const StopIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Line>
);

export const CloseIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Line>
);
