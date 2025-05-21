import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { OtherCost } from '../../types';

interface OtherCostsState {
  otherCosts: OtherCost[];
  loading: boolean;
  error: string | null;
}

const initialState: OtherCostsState = {
  otherCosts: [],
  loading: false,
  error: null,
};

export const fetchOtherCosts = createAsyncThunk(
  'otherCosts/fetchOtherCosts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const otherCostsCollection = collection(db, 'users', userId, 'otherCosts');
      const otherCostsSnapshot = await getDocs(otherCostsCollection);
      const otherCostsList: OtherCost[] = otherCostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OtherCost[];
      return otherCostsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addOtherCost = createAsyncThunk(
  'otherCosts/addOtherCost',
  async ({ userId, otherCost }: { userId: string; otherCost: Omit<OtherCost, 'id'> }, { rejectWithValue }) => {
    try {
      const otherCostsCollection = collection(db, 'users', userId, 'otherCosts');
      const docRef = await addDoc(otherCostsCollection, otherCost);
      return { id: docRef.id, ...otherCost } as OtherCost;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOtherCost = createAsyncThunk(
  'otherCosts/updateOtherCost',
  async ({ userId, otherCost }: { userId: string; otherCost: OtherCost }, { rejectWithValue }) => {
    try {
      const otherCostDoc = doc(db, 'users', userId, 'otherCosts', otherCost.id);
      const { id, ...otherCostData } = otherCost;
      await updateDoc(otherCostDoc, otherCostData);
      return otherCost;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOtherCost = createAsyncThunk(
  'otherCosts/deleteOtherCost',
  async ({ userId, otherCostId }: { userId: string; otherCostId: string }, { rejectWithValue }) => {
    try {
      const otherCostDoc = doc(db, 'users', userId, 'otherCosts', otherCostId);
      await deleteDoc(otherCostDoc);
      return otherCostId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState,
  reducers: {
    clearOtherCosts: (state) => {
      state.otherCosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts = action.payload;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts.push(action.payload);
      })
      .addCase(addOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.otherCosts.findIndex((cost) => cost.id === action.payload.id);
        if (index !== -1) {
          state.otherCosts[index] = action.payload;
        }
      })
      .addCase(updateOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteOtherCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCosts = state.otherCosts.filter((cost) => cost.id !== action.payload);
      })
      .addCase(deleteOtherCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOtherCosts } = otherCostsSlice.actions;
export default otherCostsSlice.reducer;