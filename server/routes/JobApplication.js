const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication.js');


router.post('/', async (req, res) => {
  try {
    const jobApplication = new JobApplication(req.body);
    await jobApplication.save();
    res.status(201).json(jobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobApplications = await JobApplication.find().sort({ applicationDate: -1 });
    res.json(jobApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const jobApplication = await JobApplication.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.json(jobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const jobApplication = await JobApplication.findOneAndDelete({ id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.json({ message: 'Job application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;