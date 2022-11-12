import {CartModel} from '../models/cart';
import {UserModel} from '../models/user';

export interface State {
  cart: CartModel,
  user: UserModel
}
