import { AdsterraSlot } from './AdsterraSlot';

interface BlogAdSlotProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function BlogAdSlot({ 
  position = 'top',
  className = ''
}: BlogAdSlotProps) {
  return <AdsterraSlot position={position} className={className} />;
}

export function InContentAd() {
  return <AdsterraSlot position="middle" className="my-8" />;
}

export function SidebarBlogAd() {
  return <AdsterraSlot position="top" className="sticky top-4" />;
}
