import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAllApplications, updateStatus } from '../store/slices/applicationSlice';
import { fetchPets } from '../store/slices/petSlice';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ArrowLeft,
  Calendar,
  PawPrint,
} from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { applications, isLoading } = useAppSelector((state) => state.applications);
  const { pets } = useAppSelector((state) => state.pets);

  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>(
    'all'
  );
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmButtonClass?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    dispatch(fetchAllApplications());
    if (pets.length === 0) {
      dispatch(fetchPets());
    }
  }, [dispatch, pets.length]);

  const filteredApplications =
    filter === 'all'
      ? applications
      : applications.filter((app) => app.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleApprove = (applicationId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Approve Application',
      message: 'Are you sure you want to approve this application? This will mark the pet as adopted and reject other applications for this pet. Emails will be sent to all applicants.',
      confirmText: 'Approve',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700',
      onConfirm: async () => {
        setApprovingId(applicationId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await dispatch(updateStatus({ id: applicationId, status: 'Approved' })).unwrap();
          // Refresh all applications to get updated status of all affected applications
          await dispatch(fetchAllApplications()).unwrap();
          // Refresh pets list to reflect adopted status
          await dispatch(fetchPets()).unwrap();
        } catch (error) {
          console.error('Failed to approve application:', error);
        } finally {
          setApprovingId(null);
        }
      },
    });
  };

  const handleReject = (applicationId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Application',
      message: 'Are you sure you want to reject this application? An email will be sent to the applicant.',
      confirmText: 'Reject',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        setRejectingId(applicationId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await dispatch(updateStatus({ id: applicationId, status: 'Rejected' })).unwrap();
          // Refresh all applications to ensure consistent state
          await dispatch(fetchAllApplications()).unwrap();
          // Refresh pets list to reflect any status changes
          await dispatch(fetchPets()).unwrap();
        } catch (error) {
          console.error('Failed to reject application:', error);
        } finally {
          setRejectingId(null);
        }
      },
    });
  };

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter((app) => app.status === 'Pending').length,
    approved: applications.filter((app) => app.status === 'Approved').length,
    rejected: applications.filter((app) => app.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage Pet Shelter Pro applications and pets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className=" p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <FileText className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-4xl font-bold text-emerald-700">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-100">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Applications</p>
                <p className="text-4xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Approved Applications</p>
                <p className="text-4xl font-bold text-green-700">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected Applications</p>
                <p className="text-4xl font-bold text-red-700">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Manage Pets</h2>
            <button
              onClick={() => navigate('/admin/pets')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-semibold flex items-center space-x-2"
            >
              <PawPrint className="h-5 w-5" />
              <span>Manage Pets</span>
            </button>
          </div>
          <p className="text-gray-600">
            Add, edit, or delete pets from the adoption system. You can also manually
            update pet status.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Applications</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filter === 'Pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('Approved')}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filter === 'Approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('Rejected')}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filter === 'Rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const pet = pets.find((p) => p.id === application.petId);
                return (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {pet && (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {application.petName}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Mail className="h-4 w-4" />
                            <span>{application.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Applicant: {application.userName}
                      </h4>
                      <p className="text-gray-600 text-sm">{application.message}</p>
                    </div>

                    {application.reviewedByName && (application.status === 'Approved' || application.status === 'Rejected') && (
                      <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Reviewed by:</span> {application.reviewedByName}
                        </p>
                      </div>
                    )}

                    {application.status === 'Pending' && (
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleApprove(application.id)}
                          disabled={approvingId === application.id || rejectingId === application.id}
                          className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approvingId === application.id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              <span>Approve</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(application.id)}
                          disabled={approvingId === application.id || rejectingId === application.id}
                          className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rejectingId === application.id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Rejecting...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5" />
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmButtonClass={confirmDialog.confirmButtonClass}
      />
    </div>
  );
}
