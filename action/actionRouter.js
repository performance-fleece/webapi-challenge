const express = require('express');

const Actions = require('../data/helpers/actionModel.js');
const Project = require('../data/helpers/projectModel.js');
const router = express.Router();

//access via /api/action

// GET ALL ACTIONS

router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: 'The actions information could not be retrieved' });
  }
});

//GET ACTIONS BY ID

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

//CREATE NEW ACTION

router.post(
  '/project/:project_id',
  validateProjectId,
  validateAction,
  async (req, res) => {
    const { project_id } = req.params;
    const newproject = { ...req.body, project_id };

    try {
      const action = await Actions.insert(newproject);
      res.status(201).json(action);
    } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error creating Action' });
    }
  }
);

//UPDATE ACTION

router.put('/:id', validateAction, validateActionId, async (req, res) => {
  try {
    const updated = await Actions.update(req.params.id, req.body);
    if (updated) {
      res.status(200).json(updated);
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'There was an error updating the action' });
  }
});

//DELETE ACTION

router.delete('/:id', validateActionId, async (req, res) => {
  try {
    const deleted = await Actions.remove(req.params.id);
    if (deleted == 1) {
      res.status(200).json({ message: `Action id ${req.params.id} deleted` });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: 'Error deleting action' });
  }
});

//middleware

async function validateAction(req, res, next) {
  const { notes, description } = req.body;

  if (
    notes &&
    Object.keys(notes).length &&
    (description && Object.keys(description).length)
  ) {
    if (Object.keys(description).length <= 128) {
      next();
    } else {
      res.status(404).json({
        message: 'Description must be less than 128 characters long'
      });
    }
  } else {
    res.status(404).json({
      message: 'Description and Notes are required to create an action'
    });
  }
}

async function validateActionId(req, res, next) {
  try {
    const { id } = req.params;
    const action = await Actions.get(id);
    console.log(action);
    if (Object.keys(action).length) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: 'Action id not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error validating action' });
  }
}

async function validateProjectId(req, res, next) {
  try {
    const { project_id } = req.params;
    const project = await Project.get(project_id);
    console.log(project);
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
