var express = require('express');
var router = express.Router();
let mockData = require('../utils/mockData');

/* GET all roles */
router.get('/', function (req, res, next) {
  try {
    res.status(200).send(mockData.roles);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

/* GET role by id */
router.get('/:id', function (req, res, next) {
  try {
    let result = mockData.roles.find(r => r._id === req.params.id);
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

/* CREATE role */
router.post('/', function (req, res, next) {
  try {
    // Check if name already exists
    let exists = mockData.roles.find(r => r.name === req.body.name);
    if (exists) {
      return res.status(400).send({
        message: "Role name already exists"
      });
    }

    let newObj = {
      _id: "role" + String(mockData.idCounter.role++).padStart(3, '0'),
      name: req.body.name,
      description: req.body.description || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockData.roles.push(newObj);
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
})

/* UPDATE role */
router.put('/:id', function (req, res, next) {
  try {
    let index = mockData.roles.findIndex(r => r._id === req.params.id);
    if (index !== -1) {
      // Check if new name conflicts with existing role
      if (req.body.name && req.body.name !== mockData.roles[index].name) {
        let nameExists = mockData.roles.find(r => r.name === req.body.name && r._id !== req.params.id);
        if (nameExists) {
          return res.status(400).send({
            message: "Role name already exists"
          });
        }
      }
      
      mockData.roles[index] = {
        ...mockData.roles[index],
        ...req.body,
        updatedAt: new Date()
      };
      res.status(200).send(mockData.roles[index])
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
})

/* DELETE role */
router.delete('/:id', function (req, res, next) {
  try {
    let index = mockData.roles.findIndex(r => r._id === req.params.id);
    if (index !== -1) {
      let deleted = mockData.roles.splice(index, 1)[0];
      res.status(200).send({
        message: "Role deleted successfully",
        data: deleted
      })
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
})

module.exports = router;
