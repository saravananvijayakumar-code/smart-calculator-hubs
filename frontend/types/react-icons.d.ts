// Type declarations for react-icons
declare module 'react-icons/fa6' {
  import { IconType } from 'react-icons';
  export const FaXTwitter: IconType;
  export const FaGithub: IconType;
  export const FaLinkedin: IconType;
  export * from 'react-icons/fa6';
}

declare module 'react-icons/lib' {
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
  }

  export type IconType = (props: IconBaseProps) => JSX.Element;
}

declare module 'react-icons' {
  import { IconBaseProps, IconType } from 'react-icons/lib';
  export { IconBaseProps, IconType };
}
