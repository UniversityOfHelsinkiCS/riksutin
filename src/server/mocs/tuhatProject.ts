const mockTuhatProject = [
  {
    references: [
      {
        type: {
          fi_FI: 'tyyppi',
          en_GB: 'type',
          sv_SE: 'type',
        },
      },
    ],
    endDate: '2029-02-02',
    name: {
      fi: 'Tietojenkäsittelytieteen sovelluskehitysakatemia',
      en: 'Tietojenkäsittelytieteen sovelluskehitysakatemia',
      sv: 'Tietojenkäsittelytieteen sovelluskehitysakatemia',
    },
    type: {
      fi: 'Tutkimusprojekti',
      en: 'Research project',
      sv: 'Forskningsproject',
    },
    tuhatId: '1kl9-13tf-34fr-245f',
    faculty: '1234563',
    pureId: '3345678',
    managingOrganisationUnit: '3r3r3r',
    startDate: '2024-09-09',
    participants: [
      {
        role: {
          fi_FI: 'Johtaja',
          en_GB: 'Manager',
          sv_SE: 'Ledare',
          rolePureUri: '1',
        },
        username: 'Testiuser',
        pureId: '1234567',
        firstName: 'Testi',
        lastName: 'Käyttäjä',
      },
    ],
  },
]

export default mockTuhatProject
