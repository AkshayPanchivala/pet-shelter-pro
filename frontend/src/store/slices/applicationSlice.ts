import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as applicationService from '../../services/applicationService';
import { Application, ApplicationStatus } from '../../types';

interface ApplicationState {
  applications: Application[];
  userApplications: Application[];
  isLoading: boolean;
  error: string | null;
}

interface CreateApplicationData {
  petId: string;
  message: string;
}

// Initial state
const initialState: ApplicationState = {
  applications: [],
  userApplications: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllApplications = createAsyncThunk<Application[], void, { rejectValue: string }>(
  'applications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getAllApplications();
      return response.applications;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchUserApplications = createAsyncThunk<Application[], void, { rejectValue: string }>(
  'applications/fetchUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getUserApplications();
      return response.applications;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const submitApplication = createAsyncThunk<Application, CreateApplicationData, { rejectValue: string }>(
  'applications/submit',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationService.createApplication(applicationData);
      return response.application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

export const updateStatus = createAsyncThunk<Application, { id: string; status: ApplicationStatus }, { rejectValue: string }>(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateApplicationStatus(id, status);
      return response.application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const removeApplication = createAsyncThunk<string, string, { rejectValue: string }>(
  'applications/remove',
  async (id, { rejectWithValue }) => {
    try {
      await applicationService.deleteApplication(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete application');
    }
  }
);

// Application slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all applications
    builder
      .addCase(fetchAllApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user applications
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.isLoading = false;
        state.userApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit application
    builder
      .addCase(submitApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.isLoading = false;
        state.userApplications.unshift(action.payload);
        state.error = null;
        toast.success('Application submitted successfully!');
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to submit application');
      });

    // Update status
    builder
      .addCase(updateStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action: PayloadAction<Application>) => {
        state.isLoading = false;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        state.error = null;
        const statusText = action.payload.status === 'Approved' ? 'approved' : 'rejected';
        toast.success(`Application ${statusText} successfully`);
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to update status');
      });

    // Remove application
    builder
      .addCase(removeApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeApplication.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.applications = state.applications.filter(app => app.id !== action.payload);
        state.userApplications = state.userApplications.filter(app => app.id !== action.payload);
        state.error = null;
        toast.success('Application deleted successfully');
      })
      .addCase(removeApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to delete application');
      });
  },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
