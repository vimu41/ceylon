const express = require('express');
const router = express.Router();

// Dummy in-memory data store
let destinations = [
  { id: 1, name: 'Sigiriya', description: 'Ancient rock fortress in Sri Lanka' },
  { id: 2, name: 'Ella', description: 'Mountain village with tea plantations' },
  { id: 3, name: 'Galle Fort', description: 'Historic Dutch fort on the coast' },
];

// GET all destinations
router.get('/', (req, res) => {
  res.json(destinations);
});

// GET a single destination by ID
router.get('/:id', (req, res) => {
  const destination = destinations.find(d => d.id === parseInt(req.params.id));
  if (destination) {
    res.json(destination);
  } else {
    res.status(404).json({ error: 'Destination not found' });
  }
});

// POST - Add a new destination
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const newDestination = {
    id: destinations.length + 1,
    name,
    description,
  };
  destinations.push(newDestination);
  res.status(201).json(newDestination);
});

// PUT - Update an existing destination
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const destination = destinations.find(d => d.id === id);
  if (destination) {
    destination.name = req.body.name || destination.name;
    destination.description = req.body.description || destination.description;
    res.json(destination);
  } else {
    res.status(404).json({ error: 'Destination not found' });
  }
});

// DELETE - Remove a destination
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = destinations.findIndex(d => d.id === id);
  if (index !== -1) {
    const deleted = destinations.splice(index, 1);
    res.json({ message: 'Destination deleted', deleted });
  } else {
    res.status(404).json({ error: 'Destination not found' });
  }
});

module.exports = router;
