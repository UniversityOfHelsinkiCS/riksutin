import { z } from 'zod'

export const NewResultFormZod = z.object({
  optionLabel: z.string().nonempty(),
  isSelected: z.object({
    fi: z.string().nonempty(),
    sv: z.string(),
    en: z.string().nonempty(),
  }),
})

type _NewResultFormType = z.infer<typeof NewResultFormZod>
export interface NewResultFormType extends _NewResultFormType {
  /**
   * **WARNING: CONFUSING NAMING**
   *
   * Stores the localized text to display when the corresponding option is selected.
   * _(Despite the name, this is not a boolean but a dictionary of translated strings. A better name would be `textWhenSelected`)._
   */
  isSelected: _NewResultFormType['isSelected']
}

export const NewResultZod = z.object({
  optionLabel: z.string().nonempty(),
  isSelected: z.object({
    fi: z.string().nonempty(),
    sv: z.string(),
    en: z.string().nonempty(),
  }),
  data: z.record(
    z.string(),
    z.object({
      fi: z.string(),
      sv: z.string(),
      en: z.string(),
    })
  ),
})

type _NewResult = z.infer<typeof NewResultZod>
export interface NewResult extends _NewResult {
  /**
   * **WARNING: CONFUSING NAMING**
   *
   * Stores the localized text to display when the corresponding option is selected.
   * _(Despite the name, this is not a boolean but a dictionary of translated strings. A better name would be `textWhenSelected`)._
   */
  isSelected: _NewResult['isSelected']
}

export const UpdatedResultZod = z.object({
  isSelected: z.object({
    fi: z.string().nonempty(),
    sv: z.string(),
    en: z.string().nonempty(),
  }),
  data: z.record(
    z.string(),
    z.object({
      fi: z.string(),
      sv: z.string(),
      en: z.string(),
    })
  ),
})

type _UpdatedResult = z.infer<typeof UpdatedResultZod>
export interface UpdatedResult extends _UpdatedResult {
  /**
   * **WARNING: CONFUSING NAMING**
   *
   * Stores the localized text to display when the corresponding option is selected.
   * _(Despite the name, this is not a boolean but a dictionary of translated strings. A better name would be `textWhenSelected`)._
   */
  isSelected: _UpdatedResult['isSelected']
}
