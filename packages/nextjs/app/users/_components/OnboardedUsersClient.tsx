"use client";

import { useEffect, useMemo } from "react";
import { UserCard } from "./UserCard";
import { UsersPagination } from "./UsersPagination";
import { UsersSearch } from "./UsersSearch";
import { UsersStats } from "./UsersStats";
import { useDebounce } from "~~/hooks/useDebounce";
import { useOnboardedUsers } from "~~/hooks/useOnboardedUsers";
import { UserByAddress } from "~~/services/database/repositories/users";

export const OnboardedUsersClient = () => {
  const {
    users,
    pagination,
    stats,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    setDebouncedSearch,
  } = useOnboardedUsers();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setDebouncedSearch(debouncedSearchTerm);
    setCurrentPage(1); // Reset to first page when searching
  }, [debouncedSearchTerm, setDebouncedSearch, setCurrentPage]);

  const displayedUsers = useMemo(() => users || [], [users]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-error mb-4">Error Loading Users</h1>
          <p className="text-base-content/70">Failed to load onboarded users. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">🚀 Onboarded Builders</h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Meet the talented builders who have joined the Speedrun Stylus community. Connect with fellow developers and
          explore their Web3 creations.
        </p>
      </div>

      {/* Stats Section */}
      <UsersStats
        totalUsers={stats?.totalUsers || pagination?.totalCount || 0}
        totalSubmissions={stats?.totalSubmissions || 0}
        isLoading={isLoading}
      />

      {/* Search Section */}
      <div className="mb-8">
        <UsersSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoading={isLoading} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Loading amazing builders...</p>
          </div>
        </div>
      )}

      {/* Users Grid */}
      {!isLoading && displayedUsers.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedUsers.map((user: NonNullable<UserByAddress>) => (
              <UserCard key={user.userAddress} user={user} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <UsersPagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && displayedUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-base-content/80 mb-2">
            {searchTerm ? "No builders found" : "No builders yet"}
          </h3>
          <p className="text-base-content/60">
            {searchTerm
              ? `Try adjusting your search term "${searchTerm}"`
              : "Be the first to join our amazing community!"}
          </p>
        </div>
      )}
    </div>
  );
};
