import { createSwaggerSpec } from "next-swagger-doc"

export const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Next Swagger API Example",
            version: "1.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: []
    },
    
});

