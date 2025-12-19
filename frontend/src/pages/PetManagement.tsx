import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPets, addPet, editPet, removePet } from '../store/slices/petSlice';
import { Plus, Edit, Trash2, X, ArrowLeft, PawPrint, Award, Calendar, Loader2 } from 'lucide-react';
import { Pet, PetStatus } from '../types';
import CustomSelect from '../components/CustomSelect';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';

type FormMode = 'add' | 'edit' | null;

export default function PetManagement() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pets, isLoading } = useAppSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    image: '',
    status: 'Available' as PetStatus,
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Adopted', label: 'Adopted' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      description: '',
      image: '',
      status: 'Available',
    });
    setEditingPet(null);
    setFormMode(null);
    setShowForm(false);
    setError('');
    setFieldErrors({});
  };

  const handleAdd = () => {
    setFormMode('add');
    setEditingPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      description: '',
      image: '',
      status: 'Available',
    });
    setError('');
    setFieldErrors({});
    setShowForm(true);
  };

  const handleEdit = (pet: Pet) => {
    setFormMode('edit');
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      description: pet.description,
      image: pet.image,
      status: pet.status,
    });
    setShowForm(true);
  };

  const handleDelete = (petId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Pet',
      message: 'Are you sure you want to delete this pet? This will also delete all related applications.',
      onConfirm: async () => {
        setDeletingPetId(petId);
        try {
          await dispatch(removePet(petId)).unwrap();
        } catch (error) {
          // Error is already handled by the slice with toast
        } finally {
          setDeletingPetId(null);
        }
      },
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Pet name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Pet name must be at least 2 characters';
    }

    if (!formData.species.trim()) {
      errors.species = 'Species is required';
    }

    if (!formData.breed.trim()) {
      errors.breed = 'Breed is required';
    }

    if (!formData.age) {
      errors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age)) {
        errors.age = 'Age must be a valid number';
      } else if (age < 0) {
        errors.age = 'Age cannot be negative';
      } else if (age > 50) {
        errors.age = 'Please enter a realistic age';
      }
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
    } else {
      try {
        new URL(formData.image);
      } catch {
        errors.image = 'Please enter a valid URL';
      }
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }

    const age = parseInt(formData.age);

    if (formMode === 'add') {
      dispatch(addPet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age,
        description: formData.description,
        image: formData.image,
        status: formData.status,
      }));
    } else if (formMode === 'edit' && editingPet) {
      dispatch(editPet({
        id: editingPet.id,
        petData: {
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          age,
          description: formData.description,
          image: formData.image,
          status: formData.status,
        },
      }));
    }
    resetForm();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Management</h1>
            <p className="mt-2 text-gray-600">
              Add, edit, or delete pets from the system
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Pet</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col">
              {/* Modal Header - Fixed */}
              <div className="p-6 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <PawPrint className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{formMode === 'add' ? 'Add New Pet' : 'Edit Pet'}</h2>
                      {/* <p className="text-sm text-gray-600 mt-1">Apply to adopt {pet.name}</p> */}
                    </div>
                  </div>

                  <button
                    onClick={resetForm}

                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Error Message in Modal */}
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                )}

                <form id="application-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) {
                            const { name, ...rest } = fieldErrors;
                            setFieldErrors(rest);
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Species <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.species}
                        onChange={(e) => {
                          setFormData({ ...formData, species: e.target.value });
                          if (fieldErrors.species) {
                            const { species, ...rest } = fieldErrors;
                            setFieldErrors(rest);
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.species ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {fieldErrors.species && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.species}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.breed}
                        onChange={(e) => {
                          setFormData({ ...formData, breed: e.target.value });
                          if (fieldErrors.breed) {
                            const { breed, ...rest } = fieldErrors;
                            setFieldErrors(rest);
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.breed ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {fieldErrors.breed && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.breed}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (years) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => {
                          setFormData({ ...formData, age: e.target.value });
                          if (fieldErrors.age) {
                            const { age, ...rest } = fieldErrors;
                            setFieldErrors(rest);
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.age ? 'border-red-500' : 'border-gray-300'
                          }`}
                        min="0"
                      />
                      {fieldErrors.age && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.age}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <CustomSelect
                      value={formData.status}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as PetStatus,
                        })
                      }
                      options={statusOptions}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Image <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => {
                        setFormData({ ...formData, image: url });
                        if (fieldErrors.image) {
                          const { image, ...rest } = fieldErrors;
                          setFieldErrors(rest);
                        }
                      }}
                      error={fieldErrors.image}
                    />
                    {fieldErrors.image && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.image}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (fieldErrors.description) {
                          const { description, ...rest } = fieldErrors;
                          setFieldErrors(rest);
                        }
                      }}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {fieldErrors.description && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
                    )}
                  </div>
                </form>
              </div>

              {/* Modal Footer - Fixed */}
              <div className="p-6 border-t border-gray-200 rounded-b-2xl bg-gray-50">
                <div className="flex gap-4">
                  <button
                    type="submit"
                    form="application-form"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    {formMode === 'add' ? 'Add Pet' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-md overflow-hidden relative"
            >
              {deletingPetId === pet.id && (
                <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-2" />
                    <p className="text-gray-700 font-semibold">Deleting pet...</p>
                  </div>
                </div>
              )}
              <div className="relative h-48">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    pet.status
                  )}`}
                >
                  {pet.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pet.name}</h3>

                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <PawPrint className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{pet.species}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{pet.breed}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  {pet.description.length > 25
                    ? `${pet.description.substring(0, 25)}...`
                    : pet.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    disabled={deletingPetId === pet.id}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id)}
                    disabled={deletingPetId === pet.id}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingPetId === pet.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No pets in the system</p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-semibold"
            >
              Add Your First Pet
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
