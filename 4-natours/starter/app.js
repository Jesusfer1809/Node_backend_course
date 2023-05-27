const fs = require('fs');

const express = require('express');
const { json } = require('express/lib/response');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((t) => t.id == id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const { id } = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Tour updated successfully',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
