import AutoAdSlot from './AutoAdSlot';
import { ADS_CONFIG } from '../../config/ads';

interface SidebarAdProps {
  className?: string;
}

export default function SidebarAd({ className = '' }: SidebarAdProps) {
  return (
    <div className={`hidden lg:block sticky top-20 ${className}`}>
      <div className="w-full max-w-xs">
        <AutoAdSlot
          placement="sidebar"
          className="rounded-lg shadow-sm bg-gray-50 border"
        />
      </div>
    </div>
  );
}

export { SidebarAd };