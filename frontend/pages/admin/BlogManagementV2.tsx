import { useState, useEffect } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAuthenticatedBackend } from "@/hooks/useBackend";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import {
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  List,
  Loader2,
  Zap,
  Clock,
  Edit,
  Save,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Blog {
  id: number;
  slug: string;
  title: string;
  meta_title?: string;
  meta_desc?: string;
  content_md: string;
  keywords?: string[];
  status: string;
  published_at?: string;
  source_url: string;
  kind: string;
}

interface SourceCatalog {
  id: number;
  source_url: string;
  title?: string;
  kind: string;
  eligible: boolean;
}

interface BlogSettings {
  default_tone: string;
  default_model: string;
  schedule_hour: number;
  enabled: boolean;
}

type TabType = "queue" | "published" | "settings";

export default function BlogManagementV2() {
  const { isAuthenticated } = useAdminAuth();
  const backend = useAuthenticatedBackend();
  const [activeTab, setActiveTab] = useState<TabType>("queue");
  const [loading, setLoading] = useState(false);

  const [unbloggedSources, setUnbloggedSources] = useState<SourceCatalog[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
  const [settings, setSettings] = useState<BlogSettings | null>(null);

  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);
  const [manualSourceUrl, setManualSourceUrl] = useState("");
  const [isGeneratingNow, setIsGeneratingNow] = useState(false);
  const [progressStats, setProgressStats] = useState({ remaining: 0, completed: 0, total: 0 });
  const [lastCreatedTitle, setLastCreatedTitle] = useState<string | null>(null);

  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    meta_title: "",
    meta_desc: "",
    content_md: "",
    keywords: [] as string[],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadProgress();
    }
  }, [isAuthenticated, activeTab]);

  const loadProgress = async () => {
    try {
      const data = await backend.blogV2.getProgress();
      setProgressStats(data);
    } catch (err) {
      console.error("Failed to load progress", err);
    }
  };

  const loadData = async () => {
    if (activeTab === "queue") {
      await loadUnbloggedSources();
    } else if (activeTab === "published") {
      await loadPublishedBlogs();
    } else if (activeTab === "settings") {
      await loadSettings();
    }
  };

  const loadUnbloggedSources = async () => {
    try {
      setLoading(true);
      const response = await backend.blogV2.listUnbloggedSources({ limit: 100 });
      setUnbloggedSources(response.sources);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load unblogged sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPublishedBlogs = async () => {
    try {
      setLoading(true);
      const response = await backend.blogV2.list({
        status: "PUBLISHED",
        page: 1,
        limit: 100,
      });
      setPublishedBlogs(response.blogs as any);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load published blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await backend.blogV2.getSettings();
      setSettings(response);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const discoverSources = async () => {
    try {
      setLoading(true);
      const response = await backend.sources.discover();
      toast({
        title: "Success",
        description: `Discovered ${response.discovered} sources, ${response.new_sources} new`,
      });
      await loadUnbloggedSources();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to discover sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNow = async () => {
    try {
      setIsGeneratingNow(true);
      setLastCreatedTitle(null);
      
      const data = await backend.blogV2.generateNow();
      
      if (data.success) {
        toast({
          title: "✅ Blog Created Successfully!",
          description: `Created: ${data.title}`,
        });
        setLastCreatedTitle(data.title || null);
      } else {
        toast({
          title: "Info",
          description: data.message,
          variant: data.remaining === 0 ? "default" : "destructive",
        });
      }
      
      setProgressStats({
        remaining: data.remaining,
        completed: data.completed,
        total: data.remaining + data.completed,
      });
      
      await loadData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate blog",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNow(false);
    }
  };

  const generateBlog = async (sourceUrl: string) => {
    try {
      setGeneratingUrl(sourceUrl);
      const response = await backend.blogV2.generate({ source_url: sourceUrl });
      toast({
        title: "Success",
        description: `Blog generated: ${response.blog.title}`,
      });
      await loadData();
      await loadProgress();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate blog",
        variant: "destructive",
      });
    } finally {
      setGeneratingUrl(null);
    }
  };

  const deleteBlog = async (blogId: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await backend.blogV2.deleteBlog({ blog_id: blogId });
      toast({ title: "Success", description: "Blog deleted" });
      await loadData();
      await loadProgress();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const updateSettings = async (updates: Partial<BlogSettings>) => {
    try {
      const response = await backend.blogV2.updateSettings(updates as any);
      setSettings(response);
      toast({ title: "Success", description: "Settings updated" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      meta_title: blog.meta_title || "",
      meta_desc: blog.meta_desc || "",
      content_md: blog.content_md,
      keywords: blog.keywords || [],
    });
  };

  const closeEditDialog = () => {
    setEditingBlog(null);
    setEditForm({
      title: "",
      meta_title: "",
      meta_desc: "",
      content_md: "",
      keywords: [],
    });
  };

  const saveBlogEdit = async () => {
    if (!editingBlog) return;

    try {
      setIsSaving(true);
      await backend.blogV2.update({
        blog_id: editingBlog.id,
        title: editForm.title,
        meta_title: editForm.meta_title,
        meta_desc: editForm.meta_desc,
        content_md: editForm.content_md,
        keywords: editForm.keywords,
      });
      toast({ title: "Success", description: "Blog updated successfully" });
      closeEditDialog();
      await loadPublishedBlogs();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <p className="text-center text-slate-600">Please log in to access blog management</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Management v2</h1>
        <div className="flex gap-2">
          <Button onClick={loadProgress} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={discoverSources} disabled={loading} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Discover Sources
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">✅ Completed</p>
              <p className="text-3xl font-bold text-green-900">{progressStats.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">🕒 Waiting</p>
              <p className="text-3xl font-bold text-orange-900">{progressStats.remaining}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">📊 Total</p>
              <p className="text-3xl font-bold text-blue-900">{progressStats.total}</p>
            </div>
            <List className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </Card>
      </div>

      {lastCreatedTitle && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-800 font-medium">
            ✅ Last Created: <span className="font-bold">{lastCreatedTitle}</span>
          </p>
        </Card>
      )}

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 font-medium ${
            activeTab === "queue"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600"
          }`}
        >
          <List className="w-4 h-4 inline mr-2" />
          Queue ({unbloggedSources.length})
        </button>
        <button
          onClick={() => setActiveTab("published")}
          className={`px-4 py-2 font-medium ${
            activeTab === "published"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600"
          }`}
        >
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Published ({publishedBlogs.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium ${
            activeTab === "settings"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600"
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {activeTab === "queue" && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-purple-900 mb-2">⚡ Quick Generate</h3>
                <p className="text-sm text-purple-700">
                  Generate a blog post for the next pending page in one click
                </p>
              </div>
              <Button
                onClick={generateNow}
                disabled={isGeneratingNow || progressStats.remaining === 0}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGeneratingNow ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Now
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Generate Blog Manually</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter source URL (e.g., /calculator/bmi)"
                value={manualSourceUrl}
                onChange={(e: any) => setManualSourceUrl(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (manualSourceUrl) {
                    generateBlog(manualSourceUrl);
                    setManualSourceUrl("");
                  }
                }}
                disabled={!manualSourceUrl || !!generatingUrl}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Now
              </Button>
            </div>
          </Card>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {unbloggedSources.map((source) => (
                <Card key={source.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{source.title || source.source_url}</h4>
                      <p className="text-sm text-slate-500">{source.source_url}</p>
                      <Badge variant="outline" className="mt-1">
                        {source.kind}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => generateBlog(source.source_url)}
                      disabled={generatingUrl === source.source_url}
                      size="sm"
                    >
                      {generatingUrl === source.source_url ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
              {unbloggedSources.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-slate-600">All sources have been blogged!</p>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "published" && (
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <>
              {publishedBlogs.map((blog) => (
                <Card key={blog.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{blog.title}</h4>
                      <p className="text-sm text-slate-500">/blog/{blog.slug}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge>{blog.status}</Badge>
                        <Badge variant="outline">{blog.kind}</Badge>
                        {blog.published_at && (
                          <span className="text-xs text-slate-500">
                            {new Date(blog.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(blog)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBlog(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {publishedBlogs.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-slate-600">No published blogs yet</p>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "settings" && settings && (
        <Card className="p-6 space-y-6">
          <div>
            <Label>Default Tone</Label>
            <Input
              value={settings.default_tone}
              onChange={(e: any) =>
                setSettings({ ...settings, default_tone: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Default Model</Label>
            <Input
              value={settings.default_model}
              onChange={(e: any) =>
                setSettings({ ...settings, default_model: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Schedule Hour (Sydney time)</Label>
            <Input
              type="number"
              min="0"
              max="23"
              value={settings.schedule_hour}
              onChange={(e: any) =>
                setSettings({ ...settings, schedule_hour: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={settings.enabled}
              onChange={(e: any) => setSettings({ ...settings, enabled: e.target.checked })}
            />
            <Label htmlFor="enabled">Enable Daily Cron Job</Label>
          </div>

          <Button onClick={() => updateSettings(settings)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </Card>
      )}

      <Dialog open={!!editingBlog} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e: any) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Blog title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-meta-title">Meta Title (SEO)</Label>
              <Input
                id="edit-meta-title"
                value={editForm.meta_title}
                onChange={(e: any) => setEditForm({ ...editForm, meta_title: e.target.value })}
                placeholder="SEO meta title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-meta-desc">Meta Description (SEO)</Label>
              <Input
                id="edit-meta-desc"
                value={editForm.meta_desc}
                onChange={(e: any) => setEditForm({ ...editForm, meta_desc: e.target.value })}
                placeholder="SEO meta description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-keywords">Keywords (comma-separated)</Label>
              <Input
                id="edit-keywords"
                value={editForm.keywords.join(", ")}
                onChange={(e: any) => 
                  setEditForm({ 
                    ...editForm, 
                    keywords: e.target.value.split(",").map((k: string) => k.trim()).filter(Boolean) 
                  })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <MarkdownEditor
                value={editForm.content_md}
                onChange={(content) => setEditForm({ ...editForm, content_md: content })}
                height={500}
                placeholder="Write your blog content in markdown..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={closeEditDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={saveBlogEdit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
