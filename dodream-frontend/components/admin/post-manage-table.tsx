"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api, type PostResponse } from "@/lib/api";

interface PostManageTableProps {
  posts: PostResponse[];
  onPostDeleted: (id: string) => void;
}

export function PostManageTable({ posts, onPostDeleted }: PostManageTableProps) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await api.posts.delete(id);
      onPostDeleted(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/write?edit=${slug}`);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">아직 작성된 게시글이 없습니다.</p>
        <Link href="/write">
          <Button>첫 글 작성하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">제목</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">카테고리</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">작성자</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-28">작성일</th>
            <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-32">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/posts/${post.slug}`} className="text-foreground hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{post.category}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{post.author}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  {deleteConfirm === post.id ? (
                    <>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                        확인
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post.slug)}>
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(post.id)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
