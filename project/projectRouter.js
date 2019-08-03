const express = require('express');

const Project = require('../data/helpers/projectModel.js');
const router = express.Router();

// access via /api/project/

// GET ALL PROJECTS

router.get('/', async (req, res) => {
  try {
    const projects = await Project.get();
    res.status(200).json(projects);
  } catch (err) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: 'The project information could not be retrieved' });
  }
});

//GET PROJECT BY ID

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

//CREATE NEW PROJECT

router.post('/', validateProject, async (req, res) => {
  try {
    const project = await Project.insert(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Error creating Proeject' });
  }
});

//UPDATE PROJECT

router.put('/:id', validateProject, validateProjectId, async (req, res) => {
  try {
    const updated = await Project.update(req.params.id, req.body);
    if (updated) {
      res.status(200).json(updated);
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'There was an error updating the project' });
  }
});

//DELETE PROJECT

router.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const deleted = await Project.remove(req.params.id);
    if (deleted == 1) {
      res.status(200).json({ message: `Project id ${req.params.id} deleted` });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: 'Error deleting project' });
  }
});

//GET PROJECT ACTIONS

router.get('/:id/actions', validateProjectId, async (req, res) => {
  try {
    const actions = await Project.getProjectActions(req.params.id);
    if (actions) {
      res.status(200).json(actions);
    }
  } catch (err) {
    res.status(500).json({ errorMessage: 'Error retrieving project actions' });
  }
});

//middleware

async function validateProject(req, res, next) {
  const { name, description } = req.body;

  if (
    name &&
    Object.keys(name).length &&
    (description && Object.keys(description).length)
  ) {
    next();
  } else {
    res.status(404).json({
      message: 'A name and description is required to create a project'
    });
  }
}

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: 'Project id not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error validating project' });
  }
}

module.exports = router;
