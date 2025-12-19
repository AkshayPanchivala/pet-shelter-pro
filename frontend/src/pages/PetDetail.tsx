import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPets } from '../store/slices/petSlice';
import { submitApplication, fetchUserApplications } from '../store/slices/applicationSlice';
import { ArrowLeft, Heart, Calendar, PawPrint, Award, MapPin, User, Mail, CheckCircle, X, XCircle, Clock } from 'lucide-react';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { pets, isLoading: petsLoading } = useAppSelector((state) => state.pets);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { userApplications, isLoading: applicationsLoading } = useAppSelector((state) => state.applications);

  const [message, setMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUser = user?.role === 'user';

  useEffect(() => {
    if (pets.length === 0) {
      dispatch(fetchPets());
    }
    if (isAuthenticated) {
      dispatch(fetchUserApplications());
    }
  }, [dispatch, pets.length, isAuthenticated]);

  const pet = pets.find((p) => p.id === id);

  // Show loading state while fetching pets
  if (petsLoading || (!pet && pets.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  // Show not found only if pets are loaded but pet doesn't exist
  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const existingApplication = isAuthenticated && user
    ? userApplications.find((app) => String(app.petId.id) === String(pet.id))
    : undefined;
console.log(userApplications, 'existingApplication');
  const alreadyApplied = !!existingApplication;

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(submitApplication({
        petId: pet.id,
        message,
      })).unwrap();

      // Success - close form and reset
      setMessage('');
      setShowApplicationForm(false);

      // Refresh to ensure state is in sync
      await dispatch(fetchUserApplications()).unwrap();
    } catch (error) {
      // Error is already handled by toast in Redux slice
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Adopted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canApply =
    isUser && (pet.status === 'Available' || pet.status === 'Pending') && !alreadyApplied;

  return (
    <div className="py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to all pets</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 relative bg-gray-100">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-64 md:h-full md:min-h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span
                className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(
                  pet.status
                )}`}
              >
                {pet.status}
              </span>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 lg:p-12">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Available for Adoption</span>
                </div>
              </div>

              {/* Pet Info Cards */}
              <div className="flex flex-row space-x-10 mb-8">
                <div className=" w-[200px] bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                    <PawPrint className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Species</p>
                    <p className="text-lg font-bold text-gray-900">{pet.species}</p>
                  </div>
                </div>

                <div className="w-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Breed</p>
                    <p className="text-lg font-bold text-gray-900">{pet.breed}</p>
                  </div>
                </div>

                <div className="w-[200px] bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</p>
                    <p className="text-lg font-bold text-gray-900">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  About
                </h2>
                <div
                  className="h-[150px] overflow-y-scroll pr-2 transition-all duration-300"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'transparent transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.scrollbarColor = '#10b981 transparent';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.scrollbarColor = 'transparent transparent';
                  }}
                >
                  <style>{`
                    .h-\\[150px\\]::-webkit-scrollbar {
                      width: 8px;
                    }
                    .h-\\[150px\\]::-webkit-scrollbar-button {
                      display: none;
                    }
                    .h-\\[150px\\]::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .h-\\[150px\\]::-webkit-scrollbar-thumb {
                      background: transparent;
                      border-radius: 10px;
                      transition: background 0.3s ease;
                    }
                    .h-\\[150px\\]:hover::-webkit-scrollbar-thumb {
                      background: linear-gradient(to bottom, #10b981, #14b8a6);
                    }
                    .h-\\[150px\\]:hover::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(to bottom, #059669, #0d9488);
                    }
                  `}</style>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap break-words">
                    {pet.description}
                  </p>
                </div>
              </div>

              {/* Application Section */}
              <div>
                {/* Not Authenticated Alert */}
                {!isAuthenticated && (pet.status === 'Available' || pet.status === 'Pending') && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-blue-900 font-semibold mb-2">Ready to adopt?</p>
                        <p className="text-blue-800">
                          Please{' '}
                          <button
                            onClick={() => navigate('/login')}
                            className="underline font-bold hover:text-blue-900 transition-colors"
                          >
                            login
                          </button>{' '}
                          or{' '}
                          <button
                            onClick={() => navigate('/register')}
                            className="underline font-bold hover:text-blue-900 transition-colors"
                          >
                            register
                          </button>{' '}
                          to apply for adoption
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already Applied Alert - Rejected */}
                {alreadyApplied && existingApplication?.status === 'Rejected' && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-red-900 font-semibold mb-2">Application Rejected</p>
                        <p className="text-red-800">
                          Your previous application for this pet was rejected. You cannot apply again for the same pet. Please browse{' '}
                          <button
                            onClick={() => navigate('/')}
                            className="underline font-bold hover:text-red-900 transition-colors"
                          >
                            other available pets
                          </button>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already Applied Alert - Approved */}
                {alreadyApplied && existingApplication?.status === 'Approved' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-green-900 font-semibold mb-2">Application Approved!</p>
                        <p className="text-green-800">
                          Congratulations! Your application has been approved. Check your{' '}
                          <button
                            onClick={() => navigate('/applications')}
                            className="underline font-bold hover:text-green-900 transition-colors"
                          >
                            applications
                          </button>{' '}
                          for more details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Already Applied Alert - Pending */}
                {alreadyApplied && existingApplication?.status === 'Pending' && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-yellow-900 font-semibold mb-2">Application Pending</p>
                        <p className="text-yellow-800">
                          You've already applied to adopt this pet. Check your{' '}
                          <button
                            onClick={() => navigate('/applications')}
                            className="underline font-bold hover:text-yellow-900 transition-colors"
                          >
                            applications
                          </button>{' '}
                          for status updates.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adopted Status */}
                {pet.status === 'Adopted' && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-gray-900 font-semibold mb-1">Already Adopted</p>
                        <p className="text-gray-700">
                          This pet has found a loving home and is no longer available for adoption.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                {canApply && (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Apply to Adopt {pet.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && canApply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col">
              {/* Modal Header - Fixed */}
              <div className="p-6 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Application Form</h2>
                      <p className="text-sm text-gray-600 mt-1">Apply to adopt {pet.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowApplicationForm(false);
                      setMessage('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <form id="application-form" onSubmit={handleSubmitApplication} className="space-y-6">
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Why do you want to adopt {pet.name}? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Tell us about yourself, your home, and why you'd be a great owner for this pet..."
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer - Fixed */}
              <div className="p-6 border-t border-gray-200 rounded-b-2xl bg-gray-50">
                <div className="flex gap-4">
                  <button
                    type="submit"
                    form="application-form"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplicationForm(false);
                      setMessage('');
                    }}
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
