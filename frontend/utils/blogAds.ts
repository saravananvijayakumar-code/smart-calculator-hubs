export function insertAdsIntoContent(html: string): string {
  const h2Regex = /<h2/gi;
  const h2Matches = html.match(h2Regex);
  const totalH2s = h2Matches ? h2Matches.length : 0;
  
  if (totalH2s === 0) return html;
  
  const adHTML = `
    <div class="blog-ad-placeholder my-8 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
      <div class="text-xs text-center text-slate-400 mb-2">Advertisement</div>
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-7271075626732183"
        data-ad-slot="AUTO"
        data-ad-format="fluid"
        data-full-width-responsive="true"></ins>
    </div>
  `;
  
  const adPositions = [
    Math.floor(totalH2s * 0.25),
    Math.floor(totalH2s * 0.5), 
    Math.floor(totalH2s * 0.75),  
  ];
  
  let result = html;
  let h2Count = 0;
  
  result = result.replace(/<h2/gi, (match) => {
    const currentCount = h2Count++;
    if (adPositions.includes(currentCount)) {
      return adHTML + match;
    }
    return match;
  });
  
  return result;
}

export function initializeBlogAds() {
  if (typeof window === 'undefined') return;
  
  try {
    const adElements = document.querySelectorAll('ins.adsbygoogle:not([data-ad-status])');
    
    if (adElements.length === 0) return;
    
    adElements.forEach((ad) => {
      try {
        if (ad.getAttribute('data-ad-status')) return;
        
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('Individual ad initialization error:', err);
      }
    });
  } catch (err) {
    console.error('Blog ad initialization error:', err);
  }
}
