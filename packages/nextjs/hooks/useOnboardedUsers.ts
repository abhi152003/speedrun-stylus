import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOnboardedUsers } from "~~/services/api/users";

export function useOnboardedUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["onboardedUsers", currentPage, debouncedSearch],
    queryFn: () =>
      fetchOnboardedUsers({
        page: currentPage,
        limit: 20,
        search: debouncedSearch,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    users: data?.users || [],
    pagination: data?.pagination,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    setDebouncedSearch,
    refetch,
  };
}
