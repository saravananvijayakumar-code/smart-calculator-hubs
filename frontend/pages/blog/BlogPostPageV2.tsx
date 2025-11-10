// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import backend from "~backend/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Eye, Share2 } from "lucide-react";
import { AdsterraSlot } from "@/components/ads/AdsterraSlot";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Blog {
  id: number;
  slug: string;
  title: string;
  meta_title?: string;
  meta_desc?: string;
  html: string;
  json_ld?: object;
  keywords?: string[];
  published_at?: string;
  source_url: string;
}

export default function BlogPostPageV2() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(false);
  const initializedRef = useRef(false);


  const loadBlog = async () => {
    if (!slug) {
      console.log("BlogPostPageV2: No slug provided");
      return;
    }

    console.log("BlogPostPageV2: Loading blog with slug:", slug);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("BlogPostPageV2: Calling backend.blogV2.getBySlug");
      const response = await backend.blogV2.getBySlug({ slug });
      console.log("BlogPostPageV2: Got response:", response ? "success" : "null");
      
      if (!mountedRef.current) {
        console.log("BlogPostPageV2: Component unmounted, aborting");
        return;
      }
      
      if (!response) {
        throw new Error("No data received from server");
      }
      
      setBlog(response as any);
      
      try {
        const text = (response as any).html.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        setReadingTime(Math.ceil(words / 200));
      } catch (err) {
        console.warn("Failed to calculate reading time:", err);
        setReadingTime(5);
      }
      
      if (mountedRef.current) {
        setIsReady(true);
        setLoading(false);
      }
      console.log("BlogPostPageV2: Blog loaded successfully");
    } catch (err: any) {
      console.error("BlogPostPageV2: Failed to load blog:", err);
      console.error("BlogPostPageV2: Error details:", {
        message: err.message,
        status: err.status,
        code: err.code,
        full: err
      });
      if (mountedRef.current) {
        setError(err.message || "Blog post not found");
        setLoading(false);
        setIsReady(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    initializedRef.current = true;
    
    if (!slug) {
      if (mountedRef.current) {
        setError("No blog slug provided");
        setLoading(false);
        setIsReady(false);
      }
      return;
    }
    
    if (mountedRef.current) {
      setIsReady(false);
      setLoading(true);
      setBlog(null);
      setError(null);
    }
    
    loadBlog();
    
    return () => {
      mountedRef.current = false;
    };
  }, [slug]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3 pt-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-10/12"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-9/12"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Blog Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
            <Link to="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>

        <article className="space-y-8">
          <header className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight break-words">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  {blog.published_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <time dateTime={blog.published_at}>
                        {new Date(blog.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Expert Guide</span>
                  </div>
                </div>

                {blog.keywords && blog.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.slice(0, 10).map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="space-y-6">
            {isReady && (
              <AdsterraSlot />
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-center text-gray-800 font-medium">📚 Comprehensive Guide • 🎯 Expert Tips • ✨ Practical Examples</p>
            </div>

            <Card className="p-8 md:p-12 bg-white shadow-sm border border-gray-200">
              <ErrorBoundary fallback={
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Unable to display blog content</p>
                  <Button onClick={() => window.location.reload()}>Reload Page</Button>
                </div>
              }>
                <MarkdownRenderer 
                  content={blog.html} 
                  className="prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:marker:text-blue-600" 
                />
              </ErrorBoundary>
            </Card>

            {isReady && <AdsterraSlot />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-green-50 border border-green-200">
                <h3 className="text-xl font-bold mb-3 text-gray-900">✨ Key Takeaways</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Expert-level insights and tips</li>
                  <li>• Real-world examples</li>
                  <li>• Step-by-step guidance</li>
                  <li>• Pro strategies included</li>
                </ul>
              </Card>

              <Card className="p-6 bg-blue-50 border border-blue-200">
                <h3 className="text-xl font-bold mb-3 text-gray-900">📖 What You Learned</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• How the tool works</li>
                  <li>• Common mistakes to avoid</li>
                  <li>• Advanced techniques</li>
                  <li>• Future trends</li>
                </ul>
              </Card>
            </div>

            <Card className="p-8 bg-blue-50 border border-blue-200">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  🚀 Ready to Try It Yourself?
                </h3>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Now that you're an expert, it's time to put your knowledge into action! Click below to start using the tool.
                </p>
                <Link to={blog.source_url}>
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Launch the Tool Now →
                  </Button>
                </Link>
              </div>
            </Card>

            {isReady && (
              <AdsterraSlot />
            )}

            <Card className="p-6 bg-amber-50 border border-amber-200">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Share2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Found this helpful?</h4>
                    <p className="text-gray-700 text-sm">Share this guide with others who might benefit from it!</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(blog.title);
                      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-700 text-white hover:bg-blue-800 border-blue-700"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(blog.title);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank', 'width=550,height=420');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(blog.title);
                      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank', 'width=550,height=420');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      } catch (err) {
                        console.error('Failed to copy:', err);
                      }
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy Link
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
}
