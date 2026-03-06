import { z } from 'zod';
import { insertUserSchema, insertProductSchema, users, products, orders, orderItems, reviews } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    }
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id' as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    },
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.object({
          order: z.custom<typeof orders.$inferSelect>(),
          items: z.array(z.object({
            item: z.custom<typeof orderItems.$inferSelect>(),
            product: z.custom<typeof products.$inferSelect>()
          }))
        })),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: z.object({
        items: z.array(z.object({ productId: z.number(), quantity: z.number() }))
      }),
      responses: {
        201: z.object({
          order: z.custom<typeof orders.$inferSelect>(),
          paymentUrl: z.string().optional()
        }),
        400: errorSchemas.validation,
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/products/:id/reviews' as const,
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/products/:id/reviews' as const,
      input: z.object({ rating: z.number(), comment: z.string().optional() }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  upload: {
    image: {
      method: 'POST' as const,
      path: '/api/upload' as const,
      responses: {
        200: z.object({ url: z.string() }),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
