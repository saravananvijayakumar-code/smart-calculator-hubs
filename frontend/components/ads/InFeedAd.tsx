import AutoAdSlot from './AutoAdSlot';
import { ADS_CONFIG } from '../../config/ads';

interface InFeedAdProps {
  className?: string;
  index?: number;
}

export default function InFeedAd({ className = '', index = 0 }: InFeedAdProps) {
  return (
    <div className={`w-full py-6 ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <AutoAdSlot
        placement="in-feed"
        className="w-full"
        style={{ display: 'block', textAlign: 'center' }}
      />
    </div>
  );
}

export { InFeedAd };