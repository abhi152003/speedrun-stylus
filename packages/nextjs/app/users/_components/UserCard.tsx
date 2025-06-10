import Link from "next/link";
import { PunkBlockie } from "~~/components/PunkBlockie";
import { Address } from "~~/components/scaffold-eth";
import { UserByAddress } from "~~/services/database/repositories/users";
import { getUserSocialsList } from "~~/utils/socials";

type UserCardProps = {
  user: NonNullable<UserByAddress>;
};

export const UserCard = ({ user }: UserCardProps) => {
  const userSocials = getUserSocialsList(user);
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "badge-error";
      case "BUILDER":
        return "badge-primary";
      default:
        return "badge-secondary";
    }
  };

  return (
    // <Link href={`/users/${user.userAddress}`}>
    <div className="card bg-base-100 hover:bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-base-300 hover:border-primary/30 group">
      <div className="card-body p-6">
        {/* User Avatar and Address */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-3">
            <PunkBlockie address={user.userAddress} scale={1.5} className="rounded-lg" />
            <div
              className={`badge ${getRoleBadgeColor(user.role ?? "")} badge-sm absolute -top-2 -right-2 text-white font-bold`}
            >
              {user.role}
            </div>
          </div>
          <Address address={user.userAddress} hideAvatar size="sm" />
        </div>

        {/* Location */}
        {user.location && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-base-content/70 truncate">{user.location}</span>
          </div>
        )}

        {/* Social Links */}
        {userSocials.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-3">
            {userSocials.slice(0, 3).map(({ key, value, getLink, icon: Icon }) => {
              const url = getLink?.(value);
              return url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-content/60 hover:text-primary transition-colors p-1"
                  onClick={e => e.stopPropagation()}
                  title={`${key}: ${value}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ) : null;
            })}
            {userSocials.length > 3 && <span className="text-xs text-base-content/50">+{userSocials.length - 3}</span>}
          </div>
        )}

        {/* Join Date */}
        <div className="text-center">
          <span className="text-xs text-base-content/50">Joined {joinDate}</span>
        </div>

        {/* Hover Effect Indicator */}
        <Link href={`/builders/${user.userAddress}`}>
          <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm text-primary font-medium">View Profile →</span>
          </div>
        </Link>
      </div>
    </div>
    // </Link>
  );
};
