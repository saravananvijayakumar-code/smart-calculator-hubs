import { AdsterraSlot } from './AdsterraSlot';

interface SidebarAdProps {
  className?: string;
}

export function SidebarAd({ className = '' }: SidebarAdProps) {
  return <AdsterraSlot position="top" className={className} />;
}

export default SidebarAd;
