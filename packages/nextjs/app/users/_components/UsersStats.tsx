type UsersStatsProps = {
  totalUsers: number;
  totalSubmissions: number;
  totalDeployedContracts: number;
  foundationCount: number;
  isLoading: boolean;
};

export const UsersStats = ({
  totalUsers,
  totalSubmissions,
  totalDeployedContracts,
  foundationCount,
  isLoading,
}: UsersStatsProps) => {
  const totalUsersWithFoundation = totalUsers + foundationCount;
  const totalSubmissionsWithFoundation = totalSubmissions + foundationCount;

  return (
    <div className="flex justify-center mb-8">
      <div className="stats shadow-lg bg-base-100 border border-base-300">
        <div className="stat place-items-center">
          <div className="stat-title text-base-content/70">Total Builders</div>
          <div className="stat-value text-primary">
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalUsersWithFoundation.toLocaleString()
            )}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-base-content/70">Total Submissions</div>
          <div className="stat-value text-primary">
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalSubmissionsWithFoundation.toLocaleString()
            )}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-base-content/70">Contracts Deployed</div>
          <div className="stat-value text-primary">
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalDeployedContracts.toLocaleString()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
