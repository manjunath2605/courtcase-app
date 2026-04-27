const ADMIN_ROLES = ["admin", "superadmin"];

const isAdminLike = (role) => ADMIN_ROLES.includes(role);

module.exports = {
  ADMIN_ROLES,
  isAdminLike
};
