import AutoAdSlot from './AutoAdSlot';
import { ADS_CONFIG } from '../../config/ads';

interface TopBannerAdProps {
  className?: string;
}

export default function TopBannerAd({ className = '' }: TopBannerAdProps) {
  return (
    <div className={`w-full py-4 flex justify-center ${className}`}>
      <div className="max-w-4xl w-full min-w-[300px]">
        <AutoAdSlot
          placement="top-banner"
          className="rounded-lg shadow-sm"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

export { TopBannerAd };