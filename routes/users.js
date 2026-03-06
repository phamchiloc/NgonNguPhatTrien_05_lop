var express = require('express');
var router = express.Router();
let mockData = require('../utils/mockData');

/* GET all users */
router.get('/', function (req, res, next) {
  try {
    let data = mockData.users
      .filter(u => !u.isDeleted)
      .map(user => {
        let role = mockData.roles.find(r => r._id === user.role);
        return {
          ...user,
          role: role ? { _id: role._id, name: role.name, description: role.description } : null
        };
      });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

/* GET user by id */
router.get('/:id', function (req, res, next) {
  try {
    let user = mockData.users.find(u => u._id === req.params.id && !u.isDeleted);
    if (user) {
      let role = mockData.roles.find(r => r._id === user.role);
      let result = {
        ...user,
        role: role ? { _id: role._id, name: role.name, description: role.description } : null
      };
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

/* CREATE user */
router.post('/', function (req, res, next) {
  try {
    // Check if username or email already exists
    let usernameExists = mockData.users.find(u => u.username === req.body.username);
    let emailExists = mockData.users.find(u => u.email === req.body.email);
    
    if (usernameExists) {
      return res.status(400).send({
        message: "Username already exists"
      });
    }
    if (emailExists) {
      return res.status(400).send({
        message: "Email already exists"
      });
    }

    let newObj = {
      _id: "user" + String(mockData.idCounter.user++).padStart(3, '0'),
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || "",
      avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
      status: req.body.status !== undefined ? req.body.status : false,
      role: req.body.roleId || null,
      loginCount: req.body.loginCount || 0,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockData.users.push(newObj);
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
})

/* UPDATE user */
router.put('/:id', function (req, res, next) {
  try {
    let index = mockData.users.findIndex(u => u._id === req.params.id);
    if (index !== -1) {
      mockData.users[index] = {
        ...mockData.users[index],
        ...req.body,
        updatedAt: new Date()
      };
      res.status(200).send(mockData.users[index])
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

/* SOFT DELETE user */
router.delete('/:id', function (req, res, next) {
  try {
    let index = mockData.users.findIndex(u => u._id === req.params.id);
    if (index !== -1) {
      mockData.users[index].isDeleted = true;
      mockData.users[index].updatedAt = new Date();
      res.status(200).send({
        message: "User deleted successfully",
        data: mockData.users[index]
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

/* ENABLE user - set status to true */
router.post('/enable', function (req, res, next) {
  try {
    let { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      });
    }

    let user = mockData.users.find(u => 
      u.email === email && 
      u.username === username && 
      !u.isDeleted
    );

    if (user) {
      user.status = true;
      user.updatedAt = new Date();
      res.status(200).send({
        message: "User enabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found or credentials incorrect"
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
})

/* DISABLE user - set status to false */
router.post('/disable', function (req, res, next) {
  try {
    let { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      });
    }

    let user = mockData.users.find(u => 
      u.email === email && 
      u.username === username && 
      !u.isDeleted
    );

    if (user) {
      user.status = false;
      user.updatedAt = new Date();
      res.status(200).send({
        message: "User disabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found or credentials incorrect"
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
})

module.exports = router;
