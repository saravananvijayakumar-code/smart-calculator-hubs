import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Tag, LogOut, Bot, Calculator, FileText, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { BlogPost } from '~backend/blog/types';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logout, callAdminAPI } = useAdminAuth();

  useEffect(() => {
    fetchPosts();
  }, []);









  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await backend.blog.list({ published: undefined });
      setPosts(data.posts);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setLoading(true);
      await callAdminAPI(`/admin/blog/${id}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      await fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Blog Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/blogs')}>
              <FileText className="w-4 h-4 mr-2" />
              Manage Posts
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/blogs')}>
              <Bot className="w-4 h-4 mr-2" />
              Auto-Blog
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/pwa-analytics')}>
              <Smartphone className="w-4 h-4 mr-2" />
              PWA Analytics
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/logs')}>
              <FileText className="w-4 h-4 mr-2" />
              Logs
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button onClick={() => navigate('/admin/blog/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">/{post.slug}</p>
                      {post.excerpt && (
                        <p className="text-gray-700 mb-2">{post.excerpt}</p>
                      )}
                      {/* Tags */}

                      <p className="text-xs text-gray-500">
                        Created: {new Date(post.created_at).toLocaleDateString()} | 
                        Updated: {new Date(post.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/blog/edit/${post.slug}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No posts found. Create your first post!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;