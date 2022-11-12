export const SAVE_USER = "SAVE_USER";
export const UPDATE_USER = "UPDATE_USER";
export const REMOVE_USER = 'REMOVE_USER';
export const RESTORE_USER = "RESTORE_USER";

export function UserReducer(state: any = {}, action) {
  switch (action.type) {
    case 'SAVE_USER': return action.payload;
    case 'UPDATE_USER': return action.payload;
    case 'REMOVE_USER': return {};
    case 'RESTORE_USER': return action.payload;
    default: return state;
  }
}
