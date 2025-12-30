import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/employes";

export const fetchEmployes = createAsyncThunk(
  "employes/fetchEmployes",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.get(API);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error Fetch employes : " + error);
    }
  }
);

export const addEmployes = createAsyncThunk(
  "employes/addEmployes",
  async (newEmploye, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.post(API, newEmploye);
      return newEmploye;
    } catch (error) {
      return rejectWithValue("Error added employe : " + error);
    }
  }
);

export const deleteEmployes = createAsyncThunk(
  "employes/deleteEmployes",
  async (id, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.delete(API + "/" + id);
      return id;
    } catch (error) {
      return rejectWithValue("Error deleted employe : " + error);
    }
  }
);

export const updateEmployes = createAsyncThunk(
  "employes/updateEmployes",
  async (employe, { rejectWithValue }) => {
    try {
      await axios.put(API + "/" + employe.id, employe);
      return employe;
    } catch (error) {
      return rejectWithValue("Error updated employe : " + error);
    }
  }
);

const initialState = {
  employes: [],
  loading: false,
  error: false,
  errorMessage: "",
};

export const EmployesSlice = createSlice({
  name: "employes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployes.pending, (state, action) => {
        state.loading = true;
        state.employes = [];
      })
      .addCase(fetchEmployes.fulfilled, (state, action) => {
        state.loading = false;
        state.employes = action.payload;
      })
      .addCase(fetchEmployes.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.employes = [];
        state.errorMessage = action.payload;
      })
      .addCase(addEmployes.pending, (state, action) => {
        state.isAdd = true;
      })
      .addCase(addEmployes.fulfilled, (state, action) => {
        state.employes = [...state.employes, action.payload];
      })
      .addCase(addEmployes.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteEmployes.fulfilled, (state, action) => {
        let newList = state.employes.filter((d) => d.id !== action.payload);
        state.employes = newList;
      })
      .addCase(deleteEmployes.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      })

      .addCase(updateEmployes.fulfilled, (state, action) => {
        state.employes = state.employes.map((d) =>
          d.id === action.payload.id.toString() ? action.payload : d
        );
      })
      .addCase(updateEmployes.rejected, (state, action) => {
        state.error = true;
        state.errorMessage = action.payload;
      });
  },
});

const selectAllEmployes = (state) => state.employes.employes || []; 
const selectAllParticipations = (state) => state.participations.data;
export const selectEmployeesByFormationAndName = createSelector(
  [
    selectAllEmployes,
    selectAllParticipations,
    (state, params) => params,
  ],
  (employes, participations, params) => {
    const { idFrm, searchName } = params;
    // filter by idForm
    let filtered = employes;
    if (idFrm !== undefined && idFrm !== null) {
      filtered = employes.filter((e) =>
        participations.some(
          (part) =>
            part.idemp.toString() === e.id.toString() &&
            part.idform.toString() === idFrm.toString()
        )
      );
    }

  // filter by Name

  if (searchName && searchName.trim() !== "") {

      const lowerSearch = searchName.toLowerCase().trim();

      filtered = filtered.filter((e) =>
        e.nom.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;


  }
);

export default EmployesSlice.reducer;
