import { IContact } from "./../models/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const contactsListSlice = createSlice({
  name: "contacts",
  initialState: [] as IContact[],
  reducers: {
    setContacts(state, action: PayloadAction<IContact[]>) {
      state = action.payload;
      return state;
    },
    sortContacts(state, action: PayloadAction<string>) {
      const arr = [...state];
      switch (action.payload) {
        case "ascendingAlphabet":
          arr.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
          break;
        case "descendingAlphabet":
          arr.sort((a, b) => {
            if (a.name > b.name) {
              return -1;
            }
            if (a.name < b.name) {
              return 1;
            }
            return 0;
          });
          break;
      }
      state = arr;
      return state;
    },
  },
});

export default contactsListSlice.reducer;
export const { setContacts, sortContacts } = contactsListSlice.actions;
