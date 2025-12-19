import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as petService from '../../services/petService';
import { Pet } from '../../types';

interface PetState {
  pets: Pet[];
  currentPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

interface CreatePetData {
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  status: 'Available' | 'Pending' | 'Adopted';
}

// Initial state
const initialState: PetState = {
  pets: [],
  currentPet: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPets = createAsyncThunk<Pet[], void, { rejectValue: string }>(
  'pets/fetchPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await petService.getAllPets();
      return response.pets;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pets');
    }
  }
);

export const fetchPetById = createAsyncThunk<Pet, string, { rejectValue: string }>(
  'pets/fetchPetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await petService.getPetById(id);
      return response.pet;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pet');
    }
  }
);

export const addPet = createAsyncThunk<Pet, CreatePetData, { rejectValue: string }>(
  'pets/addPet',
  async (petData, { rejectWithValue }) => {
    try {
      const response = await petService.createPet(petData);
      return response.pet;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create pet');
    }
  }
);

export const editPet = createAsyncThunk<Pet, { id: string; petData: Partial<CreatePetData> }, { rejectValue: string }>(
  'pets/editPet',
  async ({ id, petData }, { rejectWithValue }) => {
    try {
      const response = await petService.updatePet(id, petData);
      return response.pet;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pet');
    }
  }
);

export const removePet = createAsyncThunk<string, string, { rejectValue: string }>(
  'pets/removePet',
  async (id, { rejectWithValue }) => {
    try {
      await petService.deletePet(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pet');
    }
  }
);

// Pet slice
const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPet: (state) => {
      state.currentPet = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all pets
    builder
      .addCase(fetchPets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action: PayloadAction<Pet[]>) => {
        state.isLoading = false;
        state.pets = action.payload;
        state.error = null;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single pet
    builder
      .addCase(fetchPetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPetById.fulfilled, (state, action: PayloadAction<Pet>) => {
        state.isLoading = false;
        state.currentPet = action.payload;
        state.error = null;
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add pet
    builder
      .addCase(addPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPet.fulfilled, (state, action: PayloadAction<Pet>) => {
        state.isLoading = false;
        state.pets.unshift(action.payload);
        state.error = null;
        toast.success(`${action.payload.name} added successfully!`);
      })
      .addCase(addPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to create pet');
      });

    // Edit pet
    builder
      .addCase(editPet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editPet.fulfilled, (state, action: PayloadAction<Pet>) => {
        state.isLoading = false;
        const index = state.pets.findIndex(pet => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
        if (state.currentPet && state.currentPet.id === action.payload.id) {
          state.currentPet = action.payload;
        }
        state.error = null;
        toast.success(`${action.payload.name} updated successfully!`);
      })
      .addCase(editPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to update pet');
      });

    // Remove pet
    builder
      .addCase(removePet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removePet.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.pets = state.pets.filter(pet => pet.id !== action.payload);
        state.error = null;
        toast.success('Pet deleted successfully');
      })
      .addCase(removePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to delete pet');
      });
  },
});

export const { clearError, clearCurrentPet } = petSlice.actions;
export default petSlice.reducer;
