import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import backend from "~backend/client";
import type { BlogPost } from "~backend/blog/types";
import { Loader2 } from "lucide-react";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await backend.blog.list({ published: true, limit: 20 });
      setPosts(response.posts);
    } catch (err) {
      setError("Failed to load blog posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              No blog posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  {post.author && <span>{post.author}</span>}
                  {post.author && <span className="mx-2">•</span>}
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
