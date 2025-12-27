import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type PostResponse } from "@/lib/api";
import { SUB_CATEGORIES, POSTS_PER_PAGE } from "@/lib/constants";

export function usePostFilter() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: api.posts.getAll,
  });

  const filteredPosts = useMemo(() => {
    return posts.filter((post: PostResponse) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(query);
        const matchExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchContent = post.content.toLowerCase().includes(query);
        const matchTags = post.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchAuthor = post.author.toLowerCase().includes(query);
        if (!matchTitle && !matchExcerpt && !matchContent && !matchTags && !matchAuthor) {
          return false;
        }
      }

      if (activeCategory && post.category !== activeCategory) return false;
      if (activeSubCategory && post.subCategory !== activeSubCategory) return false;
      if (activeTag && !post.tags.includes(activeTag)) return false;
      return true;
    });
  }, [posts, searchQuery, activeCategory, activeSubCategory, activeTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const currentSubCategories = activeCategory ? SUB_CATEGORIES[activeCategory] || [] : [];

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCategory: string | null) => {
    setActiveSubCategory(subCategory);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const clearTagFilter = () => {
    setActiveTag(null);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return {
    // 상태
    currentPage,
    activeCategory,
    activeSubCategory,
    activeTag,
    searchQuery,
    // 데이터
    posts: currentPosts,
    filteredCount: filteredPosts.length,
    totalPages,
    currentSubCategories,
    isLoading,
    error,
    // 핸들러
    setCurrentPage,
    handleCategoryChange,
    handleSubCategoryChange,
    handleTagClick,
    handleSearchChange,
    clearTagFilter,
    clearSearch,
  };
}

