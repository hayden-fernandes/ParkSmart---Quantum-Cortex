// index.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 2. Initialize the Express app
const app = express();
const port = 3000;

// 3. Use middlewares
app.use(express.json());
app.use(cors());

// 4. Our In-Memory "Database"
let parkingSpots = [
    { id: 1, locationName: "Quantum Cortex HQ - Basement 1", spotNumber: "A01", isOccupied: false, reservedBy: null },
    { id: 2, locationName: "Quantum Cortex HQ - Basement 1", spotNumber: "A02", isOccupied: true, reservedBy: "Arjun" },
    { id: 3, locationName: "Quantum Cortex HQ - Basement 1", spotNumber: "A03", isOccupied: false, reservedBy: null },
    { id: 4, locationName: "Quantum Cortex HQ - Rooftop", spotNumber: "R01", isOccupied: false, reservedBy: null },
];

// 5. NEW: Define the Swagger/OpenAPI specification as a JavaScript object
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Park-Smart API',
        version: '1.0.0',
        description: 'API for managing parking spots for the Park-Smart application.',
        contact: {
            name: 'Alister',
            email: 'your.email@example.com',
        },
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Development server',
        },
    ],
    // Define reusable components, like our ParkingSpot object
    components: {
        schemas: {
            ParkingSpot: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    locationName: { type: 'string', example: "Quantum Cortex HQ - Basement 1" },
                    spotNumber: { type: 'string', example: "A01" },
                    isOccupied: { type: 'boolean', example: false },
                    reservedBy: { type: 'string', nullable: true, example: null },
                },
            },
        },
    },
    // Define all the paths (endpoints) for our API
    paths: {
        '/spots': {
            get: {
                summary: 'Retrieve a list of all parking spots',
                description: 'Fetches a list of all available parking spots and their current status.',
                responses: {
                    '200': {
                        description: 'A list of parking spots.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/ParkingSpot', // Reference the reusable component
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/spots/{id}': {
            get: {
                summary: 'Get a single parking spot by ID',
                description: 'Fetches the details of a single parking spot using its unique ID.',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        description: 'The numeric ID of the parking spot to retrieve.',
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Details of the parking spot.' },
                    '404': { description: 'Parking spot not found.' },
                },
            },
        },
        '/spots/{id}/book': {
            post: {
                summary: 'Book a specific parking spot',
                description: "Marks a parking spot as occupied/reserved. This is an 'Update' operation.",
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        description: 'The numeric ID of the parking spot to book.',
                        schema: { type: 'integer' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    reservedBy: { type: 'string', example: 'Alister' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Spot booked successfully.' },
                    '404': { description: 'Parking spot not found.' },
                    '409': { description: 'Conflict - Spot is already occupied.' },
                },
            },
        },
        '/spots/{id}/vacate': {
            post: {
                summary: 'Vacate a specific parking spot',
                description: 'Marks a parking spot as free/unreserved.',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        description: 'The numeric ID of the parking spot to vacate.',
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    '200': { description: 'Spot vacated successfully.' },
                    '404': { description: 'Parking spot not found.' },
                },
            },
        },
    },
};

// 6. Setup swagger-jsdoc
const swaggerDocs = swaggerJSDoc({
    swaggerDefinition,
    apis: [], // We are defining the spec in the object above, so this can be empty
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// 7. --- API ENDPOINT IMPLEMENTATIONS ---
// Notice there are NO swagger comments here anymore!

app.get('/spots', (req, res) => {
    res.status(200).json(parkingSpots);
});

app.get('/spots/:id', (req, res) => {
    const spotId = parseInt(req.params.id);
    const spot = parkingSpots.find(s => s.id === spotId);

    if (spot) {
        res.status(200).json(spot);
    } else {
        res.status(404).json({ message: 'Parking spot not found.' });
    }
});

app.post('/spots/:id/book', (req, res) => {
    const spotId = parseInt(req.params.id);
    const spot = parkingSpots.find(s => s.id === spotId);
    const { reservedBy } = req.body;

    if (!spot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    if (spot.isOccupied) {
        return res.status(409).json({ message: 'Conflict: This spot is already occupied.' });
    }
    
    spot.isOccupied = true;
    spot.reservedBy = reservedBy;
    res.status(200).json({ message: `Spot ${spot.spotNumber} booked successfully by ${reservedBy}.`, spot });
});

app.post('/spots/:id/vacate', (req, res) => {
    const spotId = parseInt(req.params.id);
    const spot = parkingSpots.find(s => s.id === spotId);

    if (!spot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    spot.isOccupied = false;
    spot.reservedBy = null;
    res.status(200).json({ message: `Spot ${spot.spotNumber} vacated successfully.`, spot });
});


// 8. Start the server
app.listen(port, () => {
    console.log(`Park-Smart server listening at http://localhost:${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
});