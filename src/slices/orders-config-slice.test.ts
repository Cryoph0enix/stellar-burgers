import { configureStore } from '@reduxjs/toolkit';
import { TFeedsResponse } from '@api';
import orderConfigSlice, {
  getFeedsAsync,
  getOrdersAsync,
  orderBurgerAsync
} from './orders-config-slice';

jest.mock('@api', () => ({
  ...jest.requireActual('@api'),
  getOrdersApi: jest.fn(),
  getFeedsApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const mockFeedsResponse: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '67dd80d66fce7d001db5b63a',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0947',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Астероидный флюоресцентный фалленианский бургер',
      createdAt: '2025-03-21T15:08:06.073Z',
      updatedAt: '2025-03-21T15:08:06.745Z',
      number: 71784
    },
    {
      _id: '67dd92a16fce7d001db5b657',
      ingredients: [
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Space краторный минеральный экзо-плантаго био-марсианский бургер',
      createdAt: '2025-03-21T16:24:01.777Z',
      updatedAt: '2025-03-21T16:24:02.540Z',
      number: 71786
    },
    {
      _id: '67dd940e6fce7d001db5b658',
      ingredients: [
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Антарианский флюоресцентный метеоритный бургер',
      createdAt: '2025-03-21T16:30:06.411Z',
      updatedAt: '2025-03-21T16:30:07.063Z',
      number: 71787
    }
  ],
  total: 71413,
  totalToday: 48
};

const mockOrdersResponse: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '67d31c09133acd001be57a27',
      ingredients: [
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Space флюоресцентный метеоритный бургер',
      createdAt: '2025-03-13T17:55:21.491Z',
      updatedAt: '2025-03-13T17:55:22.219Z',
      number: 70980
    },
    {
      _id: '67d7331b6fce7d001db5a967',
      ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa093d'],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-03-16T20:22:51.933Z',
      updatedAt: '2025-03-16T20:22:52.640Z',
      number: 71180
    }
  ],
  total: 71413,
  totalToday: 48
};

const mockBurgerOrder = {
  success: true,
  name: 'Флюоресцентный бессмертный бургер',
  order: {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        __v: 0
      }
    ],
    _id: '67d312b0133acd001be57a0e',
    owner: {
      name: 'Roman',
      email: 'Boomshak@yandex.ru',
      createdAt: '2025-03-21T16:41:48.066Z',
      updatedAt: '2025-03-21T16:41:48.719Z'
    },
    status: 'done',
    name: 'Флюоресцентный бессмертный бургер',
    createdAt: '2025-03-21T16:41:48.066Z',
    updatedAt: '2025-03-21T16:41:48.719Z',
    number: 71788,
    price: 2325
  }
};

const mockErrorMessage = {
  success: false,
  message: 'ошибка'
};

describe('test orderConfigSlice', () => {
  it('checking for a successful request getOrders', async () => {
    const mockGetOrders = jest
      .spyOn(require('@api'), 'getOrdersApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((resolve) => {
            setTimeout(() => resolve(mockOrdersResponse.orders), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isFetching).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(getOrdersAsync());
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isFetching).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;

    expect(finalState.isFetching).toBe(false); // Обновлено свойство состояния
    expect(finalState.orderList).toEqual(mockOrdersResponse.orders); // Обновлено свойство состояния
  });

  it('checking for a failed request getOrders', async () => {
    const mockGetOrders = jest
      .spyOn(require('@api'), 'getOrdersApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isFetching).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(getOrdersAsync());
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isFetching).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;
    expect(finalState.isFetching).toBe(false); // Обновлено свойство состояния
    expect(finalState.errorMessage).toBe('ошибка'); // Обновлено свойство состояния
  });

  it('checking for a successful request getFeeds', async () => {
    const mockGetFeeds = jest
      .spyOn(require('@api'), 'getFeedsApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((resolve) => {
            setTimeout(() => resolve(mockFeedsResponse), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isFetching).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(getFeedsAsync());
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isFetching).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;

    expect(finalState.isFetching).toBe(false); // Обновлено свойство состояния
    expect(finalState.feedsResponse).toEqual(mockFeedsResponse); // Обновлено свойство состояния
  });

  it('checking for a failed request getFeeds', async () => {
    const mockGetFeeds = jest
      .spyOn(require('@api'), 'getFeedsApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isFetching).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(getFeedsAsync());
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isFetching).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;
    expect(finalState.isFetching).toBe(false); // Обновлено свойство состояния
    expect(finalState.errorMessage).toBe('ошибка'); // Обновлено свойство состояния
  });

  it('checking for a successful request orderBurger', async () => {
    const mockGetOrder = jest
      .spyOn(require('@api'), 'orderBurgerApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((resolve) => {
            setTimeout(() => resolve(mockBurgerOrder), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isOrderProcessing).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(orderBurgerAsync(['ingredient_id']));
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isOrderProcessing).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;

    expect(finalState.isOrderProcessing).toBe(false); // Обновлено свойство состояния
    expect(finalState.successfulOrder).toEqual(mockBurgerOrder.order); // Обновлено свойство состояния
  });

  it('checking for a failed request orderBurger', async () => {
    const mockGetFeeds = jest
      .spyOn(require('@api'), 'orderBurgerApi')
      .mockImplementation(
        () =>
          // Обновленный путь импорта
          new Promise((_, reject) => {
            setTimeout(() => reject(mockErrorMessage), 5);
          })
      );

    const store = configureStore({
      reducer: {
        orders: orderConfigSlice
      }
    });

    const initialState = store.getState().orders;
    expect(initialState.isOrderProcessing).toBe(false); // Обновлено свойство состояния

    const dispatch = store.dispatch(orderBurgerAsync(['ingredient_id']));
    await new Promise((resolve) => setTimeout(resolve, 1));
    const pendingState = store.getState().orders;
    expect(pendingState.isOrderProcessing).toBe(true); // Обновлено свойство состояния

    await dispatch;
    const finalState = store.getState().orders;
    expect(finalState.isOrderProcessing).toBe(false); // Обновлено свойство состояния
    expect(finalState.errorMessage).toBe('ошибка'); // Обновлено свойство состояния
  });
});
