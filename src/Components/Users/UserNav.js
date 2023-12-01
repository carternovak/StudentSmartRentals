import {
  UserProfileNavigationBar,
  UserProfileNavigationLink,
} from "./UserProfilePageContainer";
const UserNav = ({ handlePageChange }) => {
  return (
    <div>
      <UserProfileNavigationBar>
        <UserProfileNavigationLink
          to="/profile"
          onClick={() => handlePageChange("user-info")}
        >
          User Info
        </UserProfileNavigationLink>
        <UserProfileNavigationLink
          to="/profile"
          onClick={() => handlePageChange("lease-info")}
        >
          Lease Info
        </UserProfileNavigationLink>
        <UserProfileNavigationLink
          to="/profile"
          onClick={() => handlePageChange("maintenance-requests")}
        >
          Maintenance Requests
        </UserProfileNavigationLink>
      </UserProfileNavigationBar>
    </div>
  );
};
export default UserNav;
