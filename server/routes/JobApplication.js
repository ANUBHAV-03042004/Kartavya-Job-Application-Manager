const express        = require('express');
const router         = express.Router();
const { Sequelize }  = require('sequelize');
const JobApplication = require('../models/JobApplication');
const authMiddleware = require('../middleware/Auth');

router.use(authMiddleware);

// CREATE
router.post('/', async (req, res) => {
  try {
    const app = await JobApplication.create({ ...req.body, userId: req.userId });
    res.status(201).json(app);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// READ ALL — sorted by most recently updated, then created, then applicationDate
router.get('/', async (req, res) => {
  try {
    const apps = await JobApplication.findAll({
      where: { userId: req.userId },
      order: [
        [Sequelize.literal(`COALESCE("updatedAt", "createdAt", "applicationDate")`), 'DESC'],
      ],
    });
    res.json(apps);
  } catch (err) {
    // Fallback if coalesce fails (columns still missing on old DB)
    try {
      const apps = await JobApplication.findAll({
        where: { userId: req.userId },
        order: [['applicationDate', 'DESC']],
      });
      res.json(apps);
    } catch (e2) { res.status(500).json({ message: e2.message }); }
  }
});

// UPDATE — manually set updatedAt so sort works immediately
router.put('/:id', async (req, res) => {
  try {
    const [n] = await JobApplication.update(
      { ...req.body, updatedAt: new Date() },
      { where: { id: req.params.id, userId: req.userId } }
    );
    if (!n) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json(await JobApplication.findByPk(req.params.id));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE
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