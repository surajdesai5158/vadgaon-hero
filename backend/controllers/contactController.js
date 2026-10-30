
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';

// SAVE CONTACT MESSAGE
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.',
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Message must contain at least 5 characters.',
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully.',
      contactId: contact._id,
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to submit your message.',
    });
  }
};

// GET ALL CONTACT MESSAGES
export const getAdminContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      messages: contacts,
      contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages.',
    });
  }
};

// MARK CONTACT MESSAGE AS READ
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID.',
      });
    }

    if (status !== 'read') {
      return res.status(400).json({
        success: false,
        message: 'Only read status is supported.',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact message marked as read.',
      contact,
    });
  } catch (error) {
    console.error('Update contact status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update contact message.',
    });
  }
};

// DELETE CONTACT MESSAGE
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID.',
      });
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully.',
    });
  } catch (error) {
    console.error('Delete contact error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact message.',
    });
  }
};
