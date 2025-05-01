const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  applicationDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Applied', 'Interview', 'Offer', 'Rejected'] },
  jobLink: { type: String, required: false },
  notes: { type: String, required: false },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);