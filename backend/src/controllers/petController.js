import Pet from '../models/Pet.js';
import Application from '../models/Application.js';

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.status(200).json({ pets });
  } catch (error) {
    console.error('Get all pets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single pet by ID
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found. It may have been adopted or removed.' });
    }

    res.status(200).json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid pet ID format' });
    }
    res.status(500).json({ message: 'Failed to retrieve pet information. Please try again.' });
  }
};

// Create new pet (Admin only)
export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, description, image, status } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Pet name is required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Pet name must be at least 2 characters long' });
    }

    if (!species || !species.trim()) {
      return res.status(400).json({ message: 'Species is required' });
    }

    if (!breed || !breed.trim()) {
      return res.status(400).json({ message: 'Breed is required' });
    }

    if (age === undefined || age === null || age === '') {
      return res.status(400).json({ message: 'Age is required' });
    }

    const ageNum = Number(age);
    if (isNaN(ageNum)) {
      return res.status(400).json({ message: 'Age must be a valid number' });
    }

    if (ageNum < 0) {
      return res.status(400).json({ message: 'Age cannot be negative' });
    }

    if (ageNum > 50) {
      return res.status(400).json({ message: 'Please enter a realistic age for the pet' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Basic URL validation
    try {
      new URL(image);
    } catch (err) {
      return res.status(400).json({ message: 'Please enter a valid image URL' });
    }

    const newPet = await Pet.create({
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim(),
      age: ageNum,
      description: description.trim(),
      image: image.trim(),
      status: status || 'Available'
    });

    res.status(201).json({
      message: 'Pet created successfully',
      pet: newPet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update pet (Admin only)
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, breed, age, description, image, status } = req.body;

    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found. It may have been deleted.' });
    }

    const updates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Pet name cannot be empty' });
      }
      if (name.trim().length < 2) {
        return res.status(400).json({ message: 'Pet name must be at least 2 characters long' });
      }
      updates.name = name.trim();
    }

    if (species !== undefined) {
      if (!species.trim()) {
        return res.status(400).json({ message: 'Species cannot be empty' });
      }
      updates.species = species.trim();
    }

    if (breed !== undefined) {
      if (!breed.trim()) {
        return res.status(400).json({ message: 'Breed cannot be empty' });
      }
      updates.breed = breed.trim();
    }

    if (age !== undefined) {
      const ageNum = Number(age);
      if (isNaN(ageNum)) {
        return res.status(400).json({ message: 'Age must be a valid number' });
      }
      if (ageNum < 0) {
        return res.status(400).json({ message: 'Age cannot be negative' });
      }
      if (ageNum > 50) {
        return res.status(400).json({ message: 'Please enter a realistic age for the pet' });
      }
      updates.age = ageNum;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ message: 'Description cannot be empty' });
      }
      if (description.trim().length < 10) {
        return res.status(400).json({ message: 'Description must be at least 10 characters long' });
      }
      updates.description = description.trim();
    }

    if (image !== undefined) {
      if (!image.trim()) {
        return res.status(400).json({ message: 'Image URL cannot be empty' });
      }
      try {
        new URL(image);
        updates.image = image.trim();
      } catch (err) {
        return res.status(400).json({ message: 'Please enter a valid image URL' });
      }
    }

    if (status !== undefined) updates.status = status;

    const updatedPet = await Pet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    res.status(200).json({
      message: 'Pet updated successfully',
      pet: updatedPet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete pet (Admin only)
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found. It may have already been deleted.' });
    }

    await Pet.findByIdAndDelete(id);

    // Also delete related applications
    const deletedApplications = await Application.deleteMany({ petId: id });

    res.status(200).json({
      message: `Pet "${pet.name}" deleted successfully${deletedApplications.deletedCount > 0 ? ` along with ${deletedApplications.deletedCount} related application(s)` : ''}`
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ message: 'Failed to delete pet. Please try again.' });
  }
};
