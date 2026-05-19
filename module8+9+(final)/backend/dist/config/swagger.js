import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MERN Backend API - Module 8 & 9',
            version: '3.0.0',
            description: 'Complete MERN Stack with Testing, Docker & Railway Deployment',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
            {
                url: 'https://api.railway.app',
                description: 'Production server (Railway)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        token: { type: 'string' },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                        description: { type: 'string' },
                        stock: { type: 'number' },
                        category: { type: 'string' },
                        image: { type: 'string' },
                        rating: { type: 'number' },
                        reviews: { type: 'array' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        items: { type: 'array' },
                        total: { type: 'number' },
                        status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered'] },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/server.ts'],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map