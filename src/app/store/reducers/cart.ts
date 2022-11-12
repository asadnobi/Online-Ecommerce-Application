export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const DELETE_CART_ITEM = 'DELETE_CART_ITEM';
export const RESTORE_CART_ITEM = 'RESTORE_CART_ITEM';
export const CLEAR_CART_ITEM = 'CLEAR_CART_ITEM';

export function CartReducer(state: any = [], action) {
  switch (action.type) {
    case 'ADD_CART_ITEM': return [...state, action.payload];
    case 'UPDATE_CART_ITEM':
      return state.map((item, index) => {
        if (index !== action.payload.index) {
          return item
        }
        return {
          ...item,
          ...action.payload.data
        }
      });
    case 'DELETE_CART_ITEM':
      return state.filter((item, index) => index !== action.payload);
    case 'RESTORE_CART_ITEM': return action.payload;
    case 'CLEAR_CART_ITEM': return [];  
    default: return state;
  }
}

