import { baseProcedure, createTRPCRouter } from '../init';
import prisma  from '@/lib/prisma';

export const appRouter = createTRPCRouter({
getUserById: baseProcedure
    .input((input) => input as string) // Reemplaza la validación de Zod con una aserción de tipo simple
    .query(async (opts) => {
      // Puedes acceder a la entrada con opts.input, que ahora es de tipo `string`
    const userId = parseInt(opts.input); // Convertir la entrada de string a number
    
    // Aquí puedes realizar la lógica de tu procedimiento, por ejemplo, consultar la base de datos
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    return user;
    }),
  getPosts: baseProcedure
    .input((input) => input as { published?: boolean; authorId?: number | null }) // Make published and authorId optional
    .query(async (opts) => {
      const { published, authorId } = opts.input;
      const posts = await prisma.post.findMany({
        where: {
          published: published, // Filter by published status
          ...(authorId !== null && { authorId: authorId }), // Filter by authorId only if provided
        },
        include: { author: true }, // Include author details
        orderBy: { id: 'desc' }, // Order by most recent posts
      });
      return posts;
    }),
  createPost: baseProcedure
    .input((input) => input as { title: string; content?: string; authorId: number; published: boolean })
    .mutation(async (opts) => {
      const { title, content, authorId, published } = opts.input;
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          published, // Use the provided published status
          authorId,
        },
      });
    return newPost;
    }),
  getAuthors: baseProcedure
    .query(async () => {
      const authors = await prisma.user.findMany();
      return authors;
    }),
});

export type AppRouter = typeof appRouter;
