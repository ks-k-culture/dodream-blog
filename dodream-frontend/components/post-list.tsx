"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Search, Loader2 } from "lucide-react";
import { CategorySidebar } from "./category-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePostFilter } from "@/hooks/use-post-filter";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function PostList() {
  const {
    currentPage,
    activeCategory,
    activeSubCategory,
    activeTag,
    searchQuery,
    posts,
    filteredCount,
    totalPages,
    currentSubCategories,
    isLoading,
    error,
    setCurrentPage,
    handleCategoryChange,
    handleSubCategoryChange,
    handleTagClick,
    handleSearchChange,
    clearTagFilter,
    clearSearch,
  } = usePostFilter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-muted-foreground">게시글을 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="flex gap-12">
      <div className="hidden md:block w-32 shrink-0">
        <CategorySidebar activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="제목, 내용, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mb-6 md:hidden">
          <select
            value={activeCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">전체</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드">백엔드</option>
            <option value="회고">회고</option>
          </select>
        </div>

        {currentSubCategories.length > 0 && (
          <div className="mb-6 flex items-center gap-4 border-b border-border">
            <button
              onClick={() => handleSubCategoryChange(null)}
              className={`pb-2 text-sm transition-colors border-b-2 -mb-px ${
                activeSubCategory === null
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              전체
            </button>
            {currentSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryChange(sub)}
                className={`pb-2 text-sm transition-colors border-b-2 -mb-px ${
                  activeSubCategory === sub
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {(activeTag || searchQuery) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                &quot;{searchQuery}&quot; 검색 결과: {filteredCount}개
              </span>
            )}
            {activeTag && (
              <Badge variant="outline" className="gap-1 cursor-pointer" onClick={clearTagFilter}>
                #{activeTag}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        <div className="divide-y divide-border">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <time>{formatDate(post.createdAt)}</time>
                <span>·</span>
                <span>{post.author}</span>
              </div>

              <Link href={`/posts/${post.slug}`} className="group block">
                <h2 className="mb-3 text-xl font-medium leading-snug text-foreground group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
              </Link>

              <p className="mb-4 leading-relaxed text-muted-foreground line-clamp-2">{stripHtml(post.excerpt)}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`text-xs transition-colors ${
                      activeTag === tag ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && <p className="py-12 text-center text-muted-foreground">해당하는 글이 없습니다.</p>}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
