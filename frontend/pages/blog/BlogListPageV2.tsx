import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import backend from "~backend/client";
import { SEOHead } from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogAdSlot } from "@/components/ads/BlogAdSlot";

interface Blog {
  id: number;
  slug: string;
  title: string;
  meta_desc?: string;
  published_at?: string;
  keywords: string[];
  kind: string;
}

export default function BlogListPageV2() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  useEffect(() => {
    loadBlogs();
  }, [currentPage]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await backend.blogV2.list({
        status: "PUBLISHED",
        page: currentPage,
        limit,
      });

      setBlogs(response.blogs as any);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: blogs.map((blog, index) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * limit + index + 1,
      url: `https://smartcalculatorhubs.com/blog/${blog.slug}`,
      name: blog.title,
    })),
  };

  return (
    <>
      <SEOHead
        title="Blog | Smart Calculator Hubs"
        description="Explore our comprehensive guides, tips, and insights about calculators, financial tools, health metrics, and more."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 break-words">
              Expert Guides & Insights
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              In-depth tutorials, expert tips, and professional guides for all your calculator and tool needs
            </p>
          </div>

          <BlogAdSlot 
            slot="2109876543"
            format="horizontal"
            className="mb-12 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4"
          />

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-8 w-24" />
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm">
              <p className="text-xl text-gray-600">
                No blog posts available yet. Check back soon!
              </p>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.slug}`}>
                    <Card className="p-6 h-full bg-white border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                          {blog.title}
                        </h2>
                        {blog.meta_desc && (
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                            {blog.meta_desc}
                          </p>
                        )}
                        {blog.published_at && (
                          <p className="text-sm text-gray-500 mb-3">
                            {new Date(blog.published_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        {blog.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {blog.keywords.slice(0, 3).map((keyword, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              <BlogAdSlot 
                slot="5432109876"
                format="fluid"
                className="my-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4"
              />

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            onClick={() => goToPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {(currentPage - 1) * limit + 1}-
                {Math.min(currentPage * limit, total)} of {total} posts
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
