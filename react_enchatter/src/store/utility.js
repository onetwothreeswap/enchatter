export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export function getChatName(participants){
    return participants.map(part => (part.username)).join(", ");
}

export function getUserRole(user){
    if (user.is_admin) return "Super Admin";
    if (user.is_staff) return "Admin";
    return "User"
}