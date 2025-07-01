type UsersStatsProps = {
  totalUsers: number;
  totalSubmissions: number;
  isLoading: boolean;
};

export const UsersStats = ({ totalUsers, totalSubmissions, isLoading }: UsersStatsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="stats shadow-lg bg-base-100 border border-base-300">
        <div className="stat place-items-center">
          <div className="stat-title text-base-content/70">Total Builders</div>
          <div className="stat-value text-primary">
            {isLoading ? <span className="loading loading-spinner loading-md"></span> : totalUsers.toLocaleString()}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-base-content/70">Total Submissions</div>
          <div className="stat-value text-primary">
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalSubmissions.toLocaleString()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
