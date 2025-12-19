import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Shelter Pro API',
      version: '1.0.0',
      description: 'A comprehensive API for managing pet adoptions, applications, and user authentication',
      contact: {
        name: 'Pet Shelter Pro',
        email: 'support@petshelterpro.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://pet-shelter-pro.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
          },
        },
        Pet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Pet ID',
            },
            name: {
              type: 'string',
              description: 'Pet name',
            },
            species: {
              type: 'string',
              description: 'Pet species (e.g., Dog, Cat)',
            },
            breed: {
              type: 'string',
              description: 'Pet breed',
            },
            age: {
              type: 'number',
              description: 'Pet age in years',
            },
            description: {
              type: 'string',
              description: 'Pet description',
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'Pet image URL',
            },
            status: {
              type: 'string',
              enum: ['Available', 'Pending', 'Adopted'],
              description: 'Pet adoption status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Record creation timestamp',
            },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Application ID',
            },
            userId: {
              type: 'string',
              description: 'User ID who submitted the application',
            },
            userName: {
              type: 'string',
              description: 'Name of the applicant',
            },
            userEmail: {
              type: 'string',
              format: 'email',
              description: 'Email of the applicant',
            },
            petId: {
              type: 'string',
              description: 'Pet ID being applied for',
            },
            petName: {
              type: 'string',
              description: 'Name of the pet',
            },
            message: {
              type: 'string',
              description: 'Application message from user',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Approved', 'Rejected'],
              description: 'Application status',
            },
            reviewedBy: {
              type: 'string',
              description: 'Admin user ID who reviewed the application',
            },
            reviewedByName: {
              type: 'string',
              description: 'Name of the admin who reviewed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application submission timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
