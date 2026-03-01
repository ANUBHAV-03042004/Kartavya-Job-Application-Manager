// // routes/JobApplication.js
// const express = require('express');
// const router = express.Router();
// const JobApplication = require('../models/JobApplication');

// // CREATE
// router.post('/', async (req, res) => {
//   try {
//     const jobApplication = await JobApplication.create(req.body);
//     res.status(201).json(jobApplication);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // READ ALL
// router.get('/', async (req, res) => {
//   try {
//     const jobApplications = await JobApplication.findAll({
//       order: [['applicationDate', 'DESC']]
//     });
//     res.json(jobApplications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // UPDATE
// router.put('/:id', async (req, res) => {
//   try {
//     const [updated] = await JobApplication.update(req.body, {
//       where: { id: req.params.id }
//     });
//     if (!updated) return res.status(404).json({ message: 'Job application not found' });
//     res.json(await JobApplication.findByPk(req.params.id));
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // DELETE
// router.delete('/:id', async (req, res) => {
//   try {
//     const deleted = await JobApplication.destroy({
//       where: { id: req.params.id }
//     });
//     if (!deleted) return res.status(404).json({ message: 'Job application not found' });
//     res.json({ message: 'Job application deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;





const express        = require('express');
const router         = express.Router();
const JobApplication = require('../models/JobApplication');
const authMiddleware = require('../middleware/Auth');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const app = await JobApplication.create({ ...req.body, userId: req.userId });
    res.status(201).json(app);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const apps = await JobApplication.findAll({
      where: { userId: req.userId },
      order: [['applicationDate', 'DESC']],
    });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const [n] = await JobApplication.update(req.body, {
      where: { id: req.params.id, userId: req.userId },
    });
    if (!n) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json(await JobApplication.findByPk(req.params.id));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const n = await JobApplication.destroy({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!n) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;