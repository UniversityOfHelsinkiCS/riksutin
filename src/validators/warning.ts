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
  //data: z.record(
  //  z.string(),
  //  z.object({
  //    fi: z.string(),
  //    sv: z.string(),
  //    en: z.string(),
  //  })
  //),
})

export type NewWarning = z.infer<typeof NewWarningZod>
