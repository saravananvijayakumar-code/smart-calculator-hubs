export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  published?: boolean;
}

export interface UpdateBlogRequest {
  slug: string;
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  published?: boolean;
}

export interface ListBlogsRequest {
  published?: boolean;
  limit?: number;
  offset?: number;
}

export interface ListBlogsResponse {
  posts: BlogPost[];
  total: number;
}

export interface GetBlogRequest {
  slug: string;
}

export interface DeleteBlogRequest {
  slug: string;
}
