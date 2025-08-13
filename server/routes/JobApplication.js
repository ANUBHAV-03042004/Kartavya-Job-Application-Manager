// routes/JobApplication.js
const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');

// CREATE
router.post('/', async (req, res) => {
  try {
    const jobApplication = await JobApplication.create(req.body);
    res.status(201).json(jobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const jobApplications = await JobApplication.findAll({
      order: [['applicationDate', 'DESC']]
    });
    res.json(jobApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await JobApplication.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Job application not found' });
    res.json(await JobApplication.findByPk(req.params.id));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await JobApplication.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Job application not found' });
    res.json({ message: 'Job application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
