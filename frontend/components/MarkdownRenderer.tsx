// @ts-nocheck
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/blog.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // Check if content is HTML (contains HTML tags) or Markdown
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  
  if (isHtml) {
    // Handle existing HTML content with calculator placeholders
    let processedContent = content;
    
    // Handle legacy TinyMCE calculator divs
    const legacyCalculatorRegex = /<div[^>]+class="embedded-calculator"[^>]+data-calculator="([^"]+)"[^>]*>.*?<\/div>/gs;
    processedContent = processedContent.replace(legacyCalculatorRegex, (match, calculatorType) => {
      const displayName = calculatorType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      return `
        <div class="calculator-placeholder border-2 border-gray-200 rounded-lg p-6 my-6 text-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div class="text-2xl mb-2">📊</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${displayName} Calculator</h3>
          <p class="text-gray-600 text-sm mb-4">Interactive calculator embedded in this blog post</p>
          <div class="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
            Calculator: ${calculatorType}
          </div>
        </div>
      `;
    });
    
    return (
      <div 
        className={`blog-content ${className}`}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  }
  
  // Handle Markdown content
  return (
    <div className={`blog-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h2(props) {
            const { children, ...rest } = props;
            return (
              <h2 className="flex items-center gap-2 text-2xl font-semibold mt-8 mb-4 text-gray-900" {...rest}>
                {children}
              </h2>
            );
          },
          h3(props) {
            const { children, ...rest } = props;
            return (
              <h3 className="flex items-center gap-2 text-xl font-semibold mt-6 mb-3 text-gray-900" {...rest}>
                {children}
              </h3>
            );
          },
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            return !isInline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          // Custom component for calculator placeholders
          div(props) {
            const { className, children, ...rest } = props;
            if (className === 'embedded-calculator') {
              const calculatorType = (rest as any)['data-calculator'];
              if (calculatorType) {
                const displayName = calculatorType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <div className="calculator-placeholder border-2 border-gray-200 rounded-lg p-6 my-6 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{displayName} Calculator</h3>
                    <p className="text-gray-600 text-sm mb-4">Interactive calculator embedded in this blog post</p>
                    <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
                      Calculator: {calculatorType}
                    </div>
                  </div>
                );
              }
            }
            return <div className={className} {...rest}>{children}</div>;
          },
          // Style links to open in new tab
          a(props) {
            const { href, children, ...rest } = props;
            const childText = typeof children === 'string' ? children : 
              (Array.isArray(children) ? children.join('') : '');
            const isCalculatorCTA = childText.includes('Try') && childText.includes('Now');
            
            if (isCalculatorCTA) {
              return (
                <a 
                  href={href}
                  className="calculator-cta-button"
                  {...rest}
                >
                  {children}
                </a>
              );
            }
            
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline"
                {...rest}
              >
                {children}
              </a>
            );
          },
          // Style images to be responsive
          img(props) {
            const { src, alt, ...rest } = props;
            return (
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-lg shadow-md my-4"
                {...rest}
              />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};