import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import {
  IComponentsState,
  TIngredient,
  TConstructorIngredient
} from '@utils-types';
import { RootState } from '../services/store';

export const getIngredientsAsync = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

// Хелпер для создания ингредиента конструктора
const createConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

const initialState: IComponentsState = {
  isFetching: false,
  components: [],
  errorMessage: null,
  constructorElements: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setBurgerBun: (state, { payload }: { payload: TIngredient }) => {
      state.constructorElements.bun = createConstructorIngredient(
        payload,
        nanoid()
      );
    },
    resetBurgerBun: (state) => {
      state.constructorElements.bun = null;
    },
    addTopping: (state, { payload }: { payload: TIngredient }) => {
      state.constructorElements.ingredients.push(
        createConstructorIngredient(payload, nanoid())
      );
    },
    setSauce: (state, { payload }: { payload: TIngredient }) => {
      const position = Math.floor(
        state.constructorElements.ingredients.length / 2
      );
      state.constructorElements.ingredients.splice(
        position,
        0,
        createConstructorIngredient(payload, nanoid())
      );
    },
    removeTopping: (state, { payload: index }: { payload: number }) => {
      state.constructorElements.ingredients.splice(index, 1);
    },
    clearConstructor: (state) => {
      state.constructorElements = initialState.constructorElements;
    },
    reorderToppingUp: (state, { payload: index }: { payload: number }) => {
      if (index === 0) return;
      [
        state.constructorElements.ingredients[index],
        state.constructorElements.ingredients[index - 1]
      ] = [
        state.constructorElements.ingredients[index - 1],
        state.constructorElements.ingredients[index]
      ];
    },
    reorderToppingDown: (state, { payload: index }: { payload: number }) => {
      if (index === state.constructorElements.ingredients.length - 1) return;
      [
        state.constructorElements.ingredients[index],
        state.constructorElements.ingredients[index + 1]
      ] = [
        state.constructorElements.ingredients[index + 1],
        state.constructorElements.ingredients[index]
      ];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getIngredientsAsync.rejected, (state, action) => {
        state.isFetching = false;
        state.errorMessage = action.error?.message ?? 'Unknown error';
      })
      .addCase(getIngredientsAsync.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.components = payload;
      });
  }
});

export const getIngredientsLoadingState = (state: RootState) =>
  state.toppings.isFetching;
export const getAllComponents = (state: RootState) => state.toppings.components;
export const getConstructorElements = (state: RootState) =>
  state.toppings.constructorElements;

export const {
  setBurgerBun,
  resetBurgerBun,
  addTopping,
  setSauce,
  removeTopping,
  clearConstructor,
  reorderToppingUp,
  reorderToppingDown
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
