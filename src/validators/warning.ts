import { z } from 'zod'

export const NewWarningFormZod = z.object({
  id: z.number(),
  country: z.string().nonempty(),
  text: z.object({
    fi: z.string().nonempty(),
    en: z.string().nonempty(),
  }),
})

export type NewWarningFormType = z.infer<typeof NewWarningFormZod>

export const NewWarningZod = z.object({
  id: z.number(),
  country: z.string().nonempty(),
  text: z.object({
    fi: z.string().nonempty(),
    en: z.string().nonempty(),
  }),
  expiry_date: z.string(),
})

export type NewWarning = z.infer<typeof NewWarningZod>

export const UpdatedWarningZod = z.object({
  id: z.number(),
  country: z.string().nonempty(),
  text: z.object({
    fi: z.string().nonempty(),
    en: z.string().nonempty(),
  }),
  expiry_date: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
})

export type UpdatedWarning = z.infer<typeof UpdatedWarningZod>
