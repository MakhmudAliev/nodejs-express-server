const express = require("express");
const uuid = require("uuid");
const router = express.Router();
const members = require("../../Members");

const idFilter = req => member => member.id === parseInt(req.params.id);

// gets all members
router.get("/", (req, res) => res.json(members));

// get single member
router.get("/:id", (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    res.json(members.filter(idFilter(req)));
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

// create member
router.post("/", (req, res) => {
  const newMember = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: "active",
  };

  if (!newMember.name || !newMember.email) {
    return res.status(400).json({ msg: "Please include name and email" });
  }
  members.push(newMember);
  res.json(members);
});

// Update member
router.put("/:id", (req, res) => {
  const found = members.some(idFilter(req));

  if (found) {
    const updMember = req.body;
    members.forEach(member => {
      if (member.id === +req.params.id) {
        member.name = updMember.name ? updMember.name : member.name;
        member.email = updMember.email ? updMember.email : member.email;
        res.json({ msg: "Member updated", member });
      }
    });
  } else {
    res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
  }
});

module.exports = router;
