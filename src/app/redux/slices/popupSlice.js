import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    settingpopup: false,
    addbookpopup: false,
    readbookpopup: false,
    recordbookpopup: false,
    returnbookpopup: false,
    addnewadminpopup: false,
};

const popupSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        toggleSettingPopup: (state) => {
            state.settingpopup = !state.settingpopup;
        },
        toggleAddBookPopup: (state) => {
            state.addbookpopup = !state.addbookpopup;
        },
        toggleReadBookPopup: (state) => {
            state.readbookpopup = !state.readbookpopup;
        },
        toggleRecordBookPopup: (state) => {
            state.recordbookpopup = !state.recordbookpopup;
        },
        toggleReturnBookPopup: (state) => {
            state.returnbookpopup = !state.returnbookpopup;
        },
        toggleAddNewAdminPopup: (state) => {
            state.addnewadminpopup = !state.addnewadminpopup;
        },
        closeAllPopups: (state) => {
            Object.keys(state).forEach((key) => {
                state[key] = false;
            });
        },
    },
});

export const {
    toggleSettingPopup,
    toggleAddBookPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup,
    toggleReturnBookPopup,
    toggleAddNewAdminPopup,
    closeAllPopups,
} = popupSlice.actions;

export default popupSlice.reducer;
