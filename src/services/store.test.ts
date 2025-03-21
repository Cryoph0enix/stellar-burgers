import { rootReducer } from './store';
import userAuthReducer from '../slices/user-auth-slice';
import burgerConstructorReducer from '../slices/burger-constructor-slice';
import orderConfigReducer from '../slices/orders-config-slice';

describe('test rootReducer', () => {
  it('checking the return value', () => {
    const userInitialState = userAuthReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    const toppingsInitialState = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    const ordersInitialState = orderConfigReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    const expectedState = {
      user: userInitialState,
      toppings: toppingsInitialState,
      orders: ordersInitialState
    };
    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(actualState).toEqual(expectedState);
  });
});
