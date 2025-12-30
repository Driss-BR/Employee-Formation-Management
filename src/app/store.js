import {configureStore} from "@reduxjs/toolkit";
import employesReducer from "../features/EmployesSlice";
import formationReducer from "../features/FormationSlice"
import participationsReducer from "../features/ParticipationSlice"

export const store = configureStore({
    reducer :{
        employes : employesReducer,
        formations :formationReducer,
        participations :participationsReducer,
    }
})