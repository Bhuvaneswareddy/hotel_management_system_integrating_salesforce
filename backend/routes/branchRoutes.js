const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// CRUD Routes
router.post('/', branchController.createBranch);      // Create Branch
router.get('/', branchController.getBranches);       // Get All Branches
router.get('/:id', branchController.getBranchById);  // Get Branch by ID
router.put('/:id', branchController.updateBranch);   // Update Branch
router.delete('/:id', branchController.deleteBranch);// Delete Branch

module.exports = router;
