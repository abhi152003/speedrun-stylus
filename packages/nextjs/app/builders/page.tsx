import { OnboardedUsersClient } from "../users/_components/OnboardedUsersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarded Users | Speedrun Stylus",
  description: "Browse all registered builders in the Arbitrum Stylus community",
};

const UsersPage = () => {
  return <OnboardedUsersClient />;
};

export default UsersPage;
