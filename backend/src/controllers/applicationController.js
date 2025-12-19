import Application from '../models/Application.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { sendApplicationApprovedEmail, sendApplicationRejectedEmail } from '../utils/emailService.js';

// Get all applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('petId', 'name species breed')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const applications = await Application.find({ userId: req.user.id })
      .populate('petId', 'name species breed image')
      .sort({ createdAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications for a specific pet
export const getPetApplications = async (req, res) => {
  try {
    const { petId } = req.params;
    const applications = await Application.find({ petId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get pet applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new application
export const createApplication = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { petId, message } = req.body;

    if (!petId || !message) {
      return res.status(400).json({ message: 'Pet ID and message are required' });
    }

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if pet is available
    if (pet.status === 'Adopted') {
      return res.status(400).json({ message: 'Pet has already been adopted' });
    }

    // Check if user already applied for this pet
    const existingApplication = await Application.findOne({ petId, userId: req.user.id });
    if (existingApplication) {
      if (existingApplication.status === 'Rejected') {
        return res.status(400).json({
          message: 'Your previous application for this pet was rejected. You cannot apply again for the same pet.'
        });
      } else if (existingApplication.status === 'Approved') {
        return res.status(400).json({
          message: 'You have already been approved to adopt this pet.'
        });
      } else {
        return res.status(400).json({
          message: 'You have already applied for this pet. Please wait for the admin decision.'
        });
      }
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newApplication = await Application.create({
      petId,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      petName: pet.name,
      status: 'Pending',
      message
    });

    // Update pet status to Pending
    await Pet.findByIdAndUpdate(petId, { status: 'Pending' });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Get admin user info
    const adminUser = await User.findById(req.user.id);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Update application status with admin info
    application.status = status;
    application.reviewedBy = adminUser._id;
    application.reviewedByName = adminUser.name;
    await application.save();

    // If approved, update pet status to Adopted and reject other applications
    if (status === 'Approved') {
      await Pet.findByIdAndUpdate(application.petId, { status: 'Adopted' });

      // Send approval email
      try {
        await sendApplicationApprovedEmail(
          application.userEmail,
          application.userName,
          application.petName,
          adminUser.name
        );
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Continue even if email fails
      }

      // Get all other pending applications to send rejection emails
      const otherApplications = await Application.find({
        petId: application.petId,
        _id: { $ne: id },
        status: 'Pending'
      });

      // Reject all other applications for this pet with admin info
      await Application.updateMany(
        {
          petId: application.petId,
          _id: { $ne: id },
          status: 'Pending'
        },
        {
          status: 'Rejected',
          reviewedBy: adminUser._id,
          reviewedByName: adminUser.name
        }
      );

      // Send rejection emails to all other applicants
      for (const otherApp of otherApplications) {
        try {
          await sendApplicationRejectedEmail(
            otherApp.userEmail,
            otherApp.userName,
            otherApp.petName,
            adminUser.name
          );
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
          // Continue even if email fails
        }
      }
    }

    // If rejected, send rejection email
    if (status === 'Rejected') {
      // Send rejection email
      try {
        await sendApplicationRejectedEmail(
          application.userEmail,
          application.userName,
          application.petName,
          adminUser.name
        );
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Continue even if email fails
      }

      const pendingApplications = await Application.find({
        petId: application.petId,
        _id: { $ne: id },
        status: { $in: ['Pending', 'Approved'] }
      });

      if (pendingApplications.length === 0) {
        await Pet.findByIdAndUpdate(application.petId, { status: 'Available' });
      }
    }

    // Convert to plain object to ensure proper serialization
    const applicationData = application.toJSON();

    res.status(200).json({
      message: 'Application status updated successfully',
      application: applicationData
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow user to delete their own application or admin to delete any
    if (req.user.role !== 'admin' && req.user.id !== application.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(id);

    // Check if there are other pending applications for this pet
    const remainingApplications = await Application.find({ petId: application.petId });
    if (remainingApplications.length === 0) {
      await Pet.findByIdAndUpdate(application.petId, { status: 'Available' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
