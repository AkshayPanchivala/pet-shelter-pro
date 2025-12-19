import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserApplications } from '../store/slices/applicationSlice';
import { fetchPets } from '../store/slices/petSlice';
import { FileText, Calendar, CheckCircle, XCircle, Clock, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { userApplications, isLoading } = useAppSelector((state) => state.applications);
  const { pets } = useAppSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchUserApplications());
    if (pets.length === 0) {
      dispatch(fetchPets());
    }
  }, [dispatch, pets.length]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

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

  const filteredApplications = statusFilter === 'all'
    ? userApplications
    : userApplications.filter(app => app.status === statusFilter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="mt-2 text-gray-600">
                Track the status of your Pet Shelter Pro applications
              </p>
            </div>
           
          </div>
        </div>

        {/* Filter Tabs */}
        {userApplications.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-2">
              {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                  {status === 'all'
                    ? ` (${userApplications.length})`
                    : ` (${userApplications.filter(app => app.status === status).length})`
                  }
                </button>
              ))}
            </div>
          </div>
        )}

        {userApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't applied to adopt any pets yet. Browse our available pets to
              find your perfect companion!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-semibold"
            >
              Browse Pets
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const pet = pets.find((p) => p.id === application.petId);
              const appId = application.id;
              const isExpanded = expandedId === appId;

              return (
                <div
                  key={appId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4"
                  style={{
                    borderLeftColor:
                      application.status === 'Approved' ? '#10b981' :
                      application.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                  }}
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        {pet && (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-24 h-24 rounded-lg object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => navigate(`/pets/${pet.id}`)}
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {application.petName}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Applied on{' '}
                              {application.createdAt
                                ? new Date(application.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
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

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpand(appId)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </button>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="mt-4 animate-in slide-in-from-top duration-300">
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Your Message:
                          </h4>
                          <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                            {application.message}
                          </p>
                        </div>

                        {application.status === 'Approved' && (
                          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-green-800 text-sm mb-2">
                                  <strong>Congratulations!</strong> Your application has been approved.
                                  We'll contact you soon with the next steps for adoption.
                                </p>
                                {application.reviewedByName && (
                                  <p className="text-green-700 text-xs">
                                    Reviewed by: <strong>{application.reviewedByName}</strong>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {application.status === 'Rejected' && (
                          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <div className="flex items-start space-x-3">
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-red-800 text-sm mb-2">
                                  Unfortunately, your application was not approved.
                                  Please consider applying for other available pets.
                                </p>
                                {application.reviewedByName && (
                                  <p className="text-red-700 text-xs">
                                    Reviewed by: <strong>{application.reviewedByName}</strong>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {application.status === 'Pending' && (
                          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                            <div className="flex items-start space-x-3">
                              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <p className="text-yellow-800 text-sm">
                                Your application is currently under review.
                                We'll notify you once a decision has been made.
                              </p>
                            </div>
                          </div>
                        )}

                        {pet && (
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => navigate(`/pets/${pet.id}`)}
                              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm"
                            >
                              View Pet Profile
                            </button>
                            <button
                              onClick={() => navigate('/')}
                              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                            >
                              Browse More Pets
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
