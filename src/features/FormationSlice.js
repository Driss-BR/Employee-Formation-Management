import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  formations: [],
  loading: false,
  error: false,
  errorMessage: "",
};
const API = "http://localhost:5001/formations";

const calculateFormationEtat = (datedebut, datefin) => {
  const currentDate = new Date().getTime();
  const start = new Date(datedebut).getTime();
  const end = new Date(datefin).getTime();

  if (currentDate < start) return "programmée";
  if (currentDate > end) return "terminée";
  return "en cours";
};

export const fetchFormations = createAsyncThunk(
  "Formations/fetchFormations",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.get(API);

      // Dynamically change the formation status according to the current date
      response.data.map((f) => {
        const expectedStatus = calculateFormationEtat(f.datedebut, f.datefin);

        if (f.etat !== expectedStatus) {
          dispatch(changeEtatFormations({ id: f.id, newEtat: expectedStatus }));
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue("Error fetch Formations : " + error);
    }
  }
);

export const addFormations = createAsyncThunk(
  "Formations/addFormations",
  async (newFormation, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const autoEtat = calculateFormationEtat(newFormation.datedebut, newFormation.datefin);
      const dataWithEtat = { ...newFormation, etat: autoEtat };
      await axios.post(API, dataWithEtat);
      return dataWithEtat;
    } catch (error) {
      return rejectWithValue("Error added Formations : " + error);
    }
  }
);

export const deleteFormations = createAsyncThunk(
  "Formations/deleteFormations",
  async (id, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.delete(API + "/" + id);
      return id;
    } catch (error) {
      return rejectWithValue("Error deleted Formations : " + error);
    }
  }
);

export const updateFormations = createAsyncThunk(
  "Formations/updateFormations",
  async (updatedFormation, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newEtat = calculateFormationEtat(updatedFormation.datedebut, updatedFormation.datefin);
      const finalUpdate = { ...updatedFormation, etat: newEtat };
      await axios.put(API + "/" + updatedFormation.id, updatedFormation);
      return finalUpdate;
    } catch (error) {
      return rejectWithValue("Error updated Formations : " + error);
    }
  }
);

export const changeEtatFormations = createAsyncThunk(
  "Formations/changeEtatFormations",
  async ({ id, newEtat }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(API + "/" + id, { etat: newEtat });
      return response.data;
    } catch (error) {
      return rejectWithValue("Error changing etat of Formations : " + error);
    }
  }
);

export const FormationsSlice = createSlice({
  name: "formations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormations.pending, (state, action) => {
        state.loading = true;
        state.formations = [];
      })
      .addCase(fetchFormations.fulfilled, (state, action) => {
        state.loading = false;
        state.formations = action.payload;
      })
      .addCase(fetchFormations.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.formations = [];
        state.errorMessage = action.payload;
      })
      .addCase(addFormations.fulfilled, (state, action) => {
        state.formations = [...state.formations, action.payload];
      })
      .addCase(addFormations.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteFormations.fulfilled, (state, action) => {
        let newList = state.formations.filter((d) => d.id !== action.payload);
        state.formations = newList;
      })
      .addCase(deleteFormations.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateFormations.fulfilled, (state, action) => {
        state.formations = state.formations.map((d) =>
          d.id === action.payload.id.toString() ? action.payload : d
        );
      })
      .addCase(updateFormations.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(changeEtatFormations.fulfilled, (state, action) => {
        state.formations = state.formations.map((d) =>
          d.id === action.payload.id.toString() ? action.payload : d
        );
      })
      .addCase(changeEtatFormations.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      });
  },
});

const selectAllFormations = (state) => state.formations.formations;
const selectAllParticipations = (state) => state.participations.data;

export const filterFormationsByIdEmpAndDateAndEtat = createSelector(
  [selectAllFormations, selectAllParticipations, (state, params) => params],
  (formations, participations, params) => {
    const { idEmp, searchEtat, startDate, endDate } = params;

    let filtred = formations;

    // filter by idEmp
    if (idEmp !== null && idEmp !== "" && idEmp !== undefined) {
      filtred = formations.filter((f) => {
        return participations.some(
          (p) =>
            p.idemp.toString() === idEmp.toString() &&
            p.idform.toString() === f.id.toString()
        );
      });
    }

    // filter by Date And Formations Etat

    let start = startDate ? new Date(startDate).getTime() : null;
    let end = endDate ? new Date(endDate).getTime() : null;

    filtred = filtred.filter((f) => {
      let fEtat =
        searchEtat === "" || searchEtat.toLowerCase() === f.etat.toLowerCase();

      let formStartDate = new Date(f.datedebut).getTime();

      const matchStart = !start || formStartDate >= start;
      const matchEnd = !end || formStartDate <= end;

      return fEtat && matchStart && matchEnd;
    });

    return filtred;
  }
);

export default FormationsSlice.reducer;
