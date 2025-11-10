import { AdsterraSlot } from './AdsterraSlot';

interface NativeBannerProps {
  className?: string;
  position?: 'top' | 'middle' | 'bottom';
}

export function NativeBanner({ className = '', position = 'top' }: NativeBannerProps) {
  return <AdsterraSlot position={position} className={className} />;
}

export default NativeBanner;
