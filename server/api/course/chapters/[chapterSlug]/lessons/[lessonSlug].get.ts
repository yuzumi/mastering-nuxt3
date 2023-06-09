import { PrismaClient } from '@prisma/client'

import { FREE_CHAPTER_SLUG } from '~/config'
import { protectRoute } from '~/server/utils'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { chapterSlug, lessonSlug } = event.context.params!

  if (chapterSlug !== FREE_CHAPTER_SLUG) {
    protectRoute(event)
  }

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug
      }
    }
  })

  if (lesson) { return lesson }

  throw createError({
    statusCode: 404,
    statusMessage: 'Lesson not found'
  })
})
