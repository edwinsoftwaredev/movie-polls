import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

export interface ISliderProperties {
  cardWidth: number;
  numberCards: number;
  isMobile: boolean;
}

const initialState: ISliderProperties = {
  cardWidth: 0,
  numberCards: 0,
  isMobile: false
};

export const sliderPropertiesSlice = createSlice({
  name: 'cardProperties',
  initialState: initialState,
  reducers: {
    setSliderProperties: (state: ISliderProperties, action: PayloadAction<ISliderProperties>) => {
      state = action.payload;
      return state;
    }
  }
});

export const sliderPropertiesSelector = createSelector(
  (state: RootState) => state.sliderProperties,
  (res: ISliderProperties) => res
);