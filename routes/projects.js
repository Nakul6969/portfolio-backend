const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new project (for admin panel - you can add auth later)
router.post('/', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;