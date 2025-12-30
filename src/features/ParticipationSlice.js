import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5002/participations";

const initialState = {
  data: [],
  loading: false,
  error: false,
  errorMessage: "",
};

export const fetchParticipations = createAsyncThunk(
  "participaions/fetchParticipations",
  async (_, { rejectWithValue }) => {
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.get(API);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error fetch Participations : " + error);
    }
  }
);
export const addParticipations = createAsyncThunk(
  "Participations/addParticipations",
  async (newParticipations, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.post(API, newParticipations);
      return newParticipations;
    } catch (error) {
      return rejectWithValue("Error added Participations : " + error);
    }
  }
);

export const deleteParticipations = createAsyncThunk(
  "Participations/deleteParticipations",
  async (id, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.delete(API + "/" + id);
      return id;
    } catch (error) {
      return rejectWithValue("Error deleted Participations : " + error);
    }
  }
);

export const updateParticipations = createAsyncThunk(
  "Participations/updateParticipations",
  async (Participations, { rejectWithValue }) => {
    try {
      await axios.put(API + "/" + Participations.id, Participations);
      return Participations;
    } catch (error) {
      return rejectWithValue("Error updated Participations : " + error);
    }
  }
);

export const ParticipationsSlice = createSlice({
  name: "participationsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
     builder
          .addCase(fetchParticipations.pending, (state, action) => {
            state.loading = true;
            state.data = [];
          })
          .addCase(fetchParticipations.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(fetchParticipations.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.data = [];
            state.errorMessage = action.payload;
          })

          .addCase(addParticipations.fulfilled, (state, action) => {
            state.data = [...state.data, action.payload];
          })
          .addCase(addParticipations.rejected, (state, action) => {
            state.error = true;
            state.errorMessage = action.payload;
          })
          .addCase(deleteParticipations.fulfilled, (state, action) => {
            let newList = state.data.filter((d) => d.id !== action.payload);
            state.data = newList;
          })
          .addCase(deleteParticipations.rejected, (state, action) => {
            state.error = true;
            state.errorMessage = action.payload;
          })
          .addCase(updateParticipations.fulfilled, (state, action) => {
            state.data = state.data.map((d) =>
              d.id === action.payload.id.toString() ? action.payload : d
            );
          })
          .addCase(updateParticipations.rejected, (state, action) => {
            state.error = true;
            state.errorMessage = action.payload;
          });
  },
});


const selectRawParticipations = (state) => state.participations.data;
const selectAllEmployes = (state) => state.employes.employes;
const selectAllFormations = (state) => state.formations.formations;

export const selectFilteredParticipations = createSelector(
  [
    selectRawParticipations,
    selectAllEmployes,
    selectAllFormations,
    (state, params) => params 
  ],
  (participations, employes, formations, params) => {
    const { searchFormation, searchEmploye } = params;

    console.log(searchEmploye)
    console.log(searchFormation)

    // data joint
    const detailed = participations.map((p) => {
      const emp = employes.find((e) => e.id.toString() === p.idemp.toString());
      const form = formations.find((f) => f.id.toString() === p.idform.toString());

      return {
        id: p.id,
        employe: emp ? emp.nom : "Inconnu",
        formation: form ? form.sujet : "Inconnu",
        datedebut: form ? form.datedebut : "---",
        datefin: form ? form.datefin : "---",
      };
    });
    
    //  filters
    return detailed.filter((item) => {
      const matchesFormation =
        Number(searchFormation) === -1 || 
        item.formation === searchFormation;

      const matchesEmploye =
        Number(searchEmploye) === -1 || 
        item.employe === searchEmploye;


        
        return matchesFormation && matchesEmploye;
      });
  }
);

export default ParticipationsSlice.reducer;
