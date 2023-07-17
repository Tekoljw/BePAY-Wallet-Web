/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  onlyGuest: [],
  home:  ['home']
};

export default authRoles;
