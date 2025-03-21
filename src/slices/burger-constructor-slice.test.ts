import { configureStore } from '@reduxjs/toolkit';
import burgerConstructorSlice, {
  setBurgerBun,
  addTopping,
  setSauce,
  removeTopping,
  reorderToppingUp,
  reorderToppingDown,
  getIngredientsAsync
} from './burger-constructor-slice';
import { IComponentsState, TIngredient } from '@utils-types';

afterEach(() => {
  jest.clearAllMocks();
});

const mockBurgerIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
  },
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  }
];

const mockGetIngredientsAsyncSuccess = {
  success: true,
  data: mockBurgerIngredients
};

const mockErrorMessage = {
  success: false,
  message: 'ошибка'
};

const initialState: IComponentsState = {
  isFetching: false,
  components: mockBurgerIngredients,
  errorMessage: null,
  constructorElements: {
    bun: null,
    ingredients: []
  }
};

const mockBurgerConstructor = {
  bun: { ...mockBurgerIngredients[0], id: mockBurgerIngredients[0]._id },
  ingredients: [
    { ...mockBurgerIngredients[2], id: mockBurgerIngredients[2]._id },
    { ...mockBurgerIngredients[1], id: mockBurgerIngredients[1]._id }
  ]
};

const mockReorderToppings = [
  { ...mockBurgerIngredients[1], id: mockBurgerIngredients[1]._id },
  { ...mockBurgerIngredients[2], id: mockBurgerIngredients[2]._id }
];

describe('test burgerConstructor', () => {
  it('adding topping', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(
      newState,
      setBurgerBun({
        ingredient: mockBurgerIngredients[0],
        id: mockBurgerIngredients[0]._id
      })
    );
    newState = burgerConstructorSlice(
      newState,
      setSauce({
        ingredient: mockBurgerIngredients[2],
        id: mockBurgerIngredients[2]._id
      })
    );
    const { constructorElements } = newState;
    expect(constructorElements).toEqual(mockBurgerConstructor);
  });

  it('remove topping', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(newState, removeTopping(0));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual([]);
  });

  it('reorder topping down', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(
      newState,
      setSauce({
        ingredient: mockBurgerIngredients[2],
        id: mockBurgerIngredients[2]._id
      })
    );
    newState = burgerConstructorSlice(newState, reorderToppingDown(0));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual(mockReorderToppings);
  });

  it('reorder topping up', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(
      newState,
      setSauce({
        ingredient: mockBurgerIngredients[2],
        id: mockBurgerIngredients[2]._id
      })
    );
    newState = burgerConstructorSlice(newState, reorderToppingUp(1));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual(mockReorderToppings);
  });

  it('checking for a successful request getIngredientsAsync', async () => {
    // Мокируем успешный ответ от API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGetIngredientsAsyncSuccess)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        ingredients: burgerConstructorSlice
      }
    });

    expect(store.getState().ingredients.isFetching).toBe(false);
    const dispatch = store.dispatch(getIngredientsAsync());
    expect(store.getState().ingredients.isFetching).toBe(true);
    await dispatch;
    const finalState = store.getState().ingredients;
    expect(finalState.isFetching).toBe(false);
    expect(finalState.components).toEqual(mockBurgerIngredients);
  });

  it('checking for a failed request getIngredientsAsync', async () => {
    // Мокируем ошибочный ответ от API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorMessage)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        ingredients: burgerConstructorSlice
      }
    });
    expect(store.getState().ingredients.isFetching).toBe(false);
    const dispatch = store.dispatch(getIngredientsAsync());
    expect(store.getState().ingredients.isFetching).toBe(true);
    await dispatch;
    const finalState = store.getState().ingredients;
    expect(finalState.isFetching).toBe(false);
    expect(finalState.errorMessage).toEqual('ошибка');
  });

  it('removing topping from empty constructor', () => {
    const newState = burgerConstructorSlice(initialState, removeTopping(0));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual([]);
  });

  it('reorder topping with invalid index (negative index)', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(newState, reorderToppingUp(-1));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual([
      { ...mockBurgerIngredients[1], id: mockBurgerIngredients[1]._id }
    ]);
  });

  it('reorder topping with invalid index (index out of bounds)', () => {
    let newState = burgerConstructorSlice(
      initialState,
      addTopping({
        ingredient: mockBurgerIngredients[1],
        id: mockBurgerIngredients[1]._id
      })
    );
    newState = burgerConstructorSlice(newState, reorderToppingDown(5));
    const { constructorElements } = newState;
    expect(constructorElements.ingredients).toEqual([
      { ...mockBurgerIngredients[1], id: mockBurgerIngredients[1]._id }
    ]);
  });
});
