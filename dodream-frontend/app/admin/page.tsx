"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { api, type PostResponse } from "@/lib/api";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { PostManageTable } from "@/components/admin/post-manage-table";

export default function AdminPage() {
  const { user, login, logout } = useAuth();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await api.posts.getAll();
      setPosts(data);
    } catch (err) {
      console.error("게시글 로드 실패:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handlePostDeleted = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  if (!user) {
    return <AdminLoginForm onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-foreground">게시글 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.name || user.email}님 환영합니다</p>
          </div>
          <div className="flex gap-3">
            <Link href="/write">
              <Button>새 글 작성</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              로그아웃
            </Button>
          </div>
        </div>

        {postsLoading ? (
          <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
        ) : (
          <PostManageTable posts={posts} onPostDeleted={handlePostDeleted} />
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← 블로그로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
