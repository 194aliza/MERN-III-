export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN E-Commerce API',
      version: '1.0.0',
      description: 'Complete REST API for MERN E-Commerce Platform with Auth, Products, Cart, Orders, and Payments',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
      {
        url: 'https://api.railway.app',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['customer', 'admin'] },
            cartItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'number' },
                },
              },
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
            category: { type: 'string' },
            isFeatured: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                },
              },
            },
            totalAmount: { type: 'number' },
            stripeSessionId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            db: { type: 'string' },
            uptime: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health Check Endpoint',
          description: 'Returns API and database health status',
          responses: {
            '200': {
              description: 'Healthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthStatus' },
                },
              },
            },
          },
        },
      },
      '/api/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            '400': { description: 'User already exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products',
          responses: {
            '200': {
              description: 'List of all products',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      products: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Create product (Admin)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    image: { type: 'string' },
                    category: { type: 'string' },
                  },
                  required: ['name', 'description', 'price', 'image', 'category'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Product created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' },
                },
              },
            },
            '403': { description: 'Admin only' },
          },
        },
      },
      '/api/products/featured': {
        get: {
          tags: ['Products'],
          summary: 'Get featured products',
          responses: {
            '200': {
              description: 'List of featured products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Get cart products',
          security: [{ cookieAuth: [] }],
          responses: {
            '200': {
              description: 'Cart items',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Cart'],
          summary: 'Add to cart',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    productId: { type: 'string' },
                  },
                  required: ['productId'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Added to cart' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: [],
};
