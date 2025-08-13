'use server'

import { PrismaClient } from './generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function createPost(formData: FormData) {
const title = formData.get('title') as string
const content = formData.get('content') as string

await prisma.post.create({
    data: {    
    title,
    content,
    }
})

}

export async function checkUserExist(userName: string) {
  const user = await prisma.user.findFirst({
    where: {
      name: userName,
    },
  });
  return user;
}
