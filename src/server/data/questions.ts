import type { Question } from '@types'

const getQuestionData = (): Question[] => [
  {
    id: 1,
    surveyId: 1,
    parentId: null,
    priority: 0,
    title: {
      fi: 'Lomakkeen täyttäjä',
      sv: 'Person providing the information',
      en: 'Person providing the information',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: { type: 'noneditable', options: [] },
    visibility: {},
  },
  {
    id: 2,
    surveyId: 1,
    parentId: null,
    priority: 0,
    title: {
      fi: 'Projektin omistaja',
      sv: 'Person responsible for the project',
      en: 'Person responsible for the project',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: {
      type: 'employeeSelect',
      options: [],
      label: {
        fi: 'Hae omistaja',
        sv: 'Search for the owner',
        en: 'Search for the owner',
      },
    },
    visibility: {},
  },
  {
    id: 3,
    surveyId: 1,
    parentId: null,
    priority: 2,
    title: {
      fi: 'Yhteistyön/yhteistyöprojektin nimi',
      sv: 'Name of the collaboration/project',
      en: 'Name of the collaboration/project',
    },
    text: {
      fi: 'Anna yhteistyöprojektin nimi tai lyhyt kuvaus yhteistyöstä',
      sv: '',
      en: 'Please enter the name of the project/collaboration or a short description',
    },
    optionData: { type: 'text', options: [] },
    visibility: {},
  },
  {
    id: 4,
    surveyId: 1,
    parentId: null,
    priority: 3,
    title: {
      fi: 'Yhteistyökonsortion koostumus',
      sv: 'Composition of consortium',
      en: 'Composition of consortium',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista yhteistyötäsi parhaiten kuvaava vaihtoehto.',
      sv: '',
      en: 'Choose the most fitting description of your collaboration from among the alternatives.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'bilateral',
          label: 'bilateral',
          title: {
            fi: 'Kahdenvälinen',
            sv: 'Bilateral',
            en: 'Bilateral',
          },
        },
        {
          id: 'multilateral',
          label: 'multilateral',
          title: {
            fi: 'Monenkeskeinen',
            sv: 'Multilateral',
            en: 'Multilateral',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 6,
    surveyId: 1,
    parentId: null,
    priority: 6,
    title: {
      fi: 'Yhteistyöorganisaation tyyppi',
      sv: 'Type of the partner organisation',
      en: 'Type of the partner organisation',
    },
    text: {
      fi: 'Valitse listasta yhteistyökumppania parhaiten kuvaava vaihtoehto',
      sv: '',
      en: 'Select the alternative best describing the partner organisation',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'university',
          label: 'university',
          title: {
            fi: 'Yliopisto',
            sv: 'University',
            en: 'University',
          },
        },
        {
          id: 'otherResearchOrg',
          label: 'otherResearchOrg',
          title: {
            fi: 'Muu tutkimuslaitos',
            sv: 'Other Research Organisation',
            en: 'Other Research Organisation',
          },
        },
        {
          id: 'company',
          label: 'company',
          title: {
            fi: 'Yritys',
            sv: 'Private company',
            en: 'Private company',
          },
        },
        {
          id: 'ngo',
          label: 'ngo',
          title: {
            fi: 'Kansalaisjärjestö',
            sv: 'NGO',
            en: 'NGO',
          },
        },
        {
          id: 'otherType',
          label: 'otherType',
          title: {
            fi: 'Muu',
            sv: 'Other',
            en: 'Other',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 7,
    surveyId: 1,
    parentId: null,
    priority: 20,
    title: {
      fi: 'Lisätietoja',
      sv: 'Additional information ',
      en: 'Additional information',
    },
    text: {
      fi: 'Kirjoita tähän kenttään tärkeiksi katsomiasi lisätietoja yhteistyöstä.',
      sv: '',
      en: 'Please provide any additional information regarding the collaboration.',
    },
    optionData: {
      type: 'text',
      options: [],
      attributes: {
        multiline: true,
        minRows: 5,
        inputProps: { maxLength: 500 },
      },
    },
    visibility: {},
  },
  {
    id: 8,
    surveyId: 1,
    parentId: null,
    priority: 5,
    title: {
      fi: 'Yhteistyökumppanin sijaintimaa',
      sv: 'Home country of partner organisation',
      en: 'Home country of partner organisation',
    },
    text: {
      fi: 'Jos kyseessä on kahdenvälinen yhteistyö, valitse kumppanin sijaintimaa listasta. Jos kyseessä on monenkeskinen yhteistyö, valitse listasta koordinoivan organisaation sijaintimaa',
      sv: '',
      en: 'In the case of bilateral collaboration, choose the country of location of your partner from the list. In the case of multilateral colllaboration, choose the country of the co-ordinating organisation',
    },
    optionData: {
      type: 'countrySelect',
      options: [],
      label: {
        fi: 'Valitse sijaintimaa',
        sv: 'Select the country',
        en: 'Select the country',
      },
    },
    visibility: {},
  },
  {
    id: 9,
    surveyId: 1,
    parentId: null,
    priority: 8,
    title: {
      fi: 'Helsingin yliopiston asema yhteistyössä',
      sv: 'Role of UH in collaboration',
      en: 'Role of UH in collaboration',
    },
    shortTitle: {
      fi: 'HY:n asema yhteistyössä',
      sv: 'Role of UH in collaboration',
      en: 'Role of UH in collaboration',
    },
    text: {
      fi: 'Valitse listasta Helsingin yliopiston asemaa hankkeessasi parhaiten kuvaava vaihtoehto',
      sv: '',
      en: "Select the alternative, which best describes the University of Helsinki's role in the collaboration.",
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'coordinator',
          label: 'coordinator',
          title: {
            fi: 'Yhteistyön koordinaattori',
            sv: 'Coordinator',
            en: 'Coordinator',
          },
        },
        {
          id: 'partner',
          label: 'partner',
          title: {
            fi: 'Kumppani tai tasaveroinen partneri',
            sv: 'Partner',
            en: 'Partner',
          },
        },
        {
          id: 'otherRole',
          label: 'otherRole',
          title: {
            fi: 'Muu',
            sv: 'Other',
            en: 'Other',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 10,
    surveyId: 1,
    parentId: null,
    priority: 9,
    title: {
      fi: 'Onko kirjallinen sopimus solmittu tai tullaanko sellainen solmimaan ennen yhteistyön aloittamista?',
      sv: 'Has a written agreement been made, or will one be concluded prior to starting the collaboration?',
      en: 'Has a written agreement been made, or will one be concluded prior to starting the collaboration?',
    },
    shortTitle: {
      fi: 'Kirjallinen sopimus',
      sv: 'Written agreement',
      en: 'Written agreement',
    },
    text: {
      fi: 'Ilmaise tässä, onko yhteistyöstä tehty jo sopimus, tai onko sellainen valmisteilla.',
      sv: '',
      en: 'Indicate here, if an agreement has either already been made or is in the process of being made.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'agreementDone',
          label: 'agreementDone',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
        },
        {
          id: 'agreementNotDone',
          label: 'agreementNotDone',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
        },
      ],
    },
    visibility: {},
  },

  {
    id: 11,
    surveyId: 1,
    parentId: null,
    priority: 10,
    title: {
      fi: 'Yhteistyön muodot',
      sv: 'Forms of collaboration',
      en: 'Forms of collaboration',
    },
    text: {
      fi: 'Valitse listan yhteistyömuodoista kaikki hankkeessa todennäköisesti toteutettavaksi aiotut, vaikkei varmuutta toteutuksesta olisikaan',
      sv: '',
      en: 'Select from as many intended actions foreseen in your collaboration from among the alternatives, even if there is not yet certainty regarding implementation',
    },
    optionData: {
      type: 'multipleChoice',
      options: [
        {
          id: 'research',
          label: 'research',
          title: {
            fi: 'Tutkimusyhteistyö',
            sv: 'Research collaboration',
            en: 'Research collaboration',
          },
        },
        {
          id: 'education',
          label: 'education',
          title: {
            fi: 'Koulutus/opetusyhteistyö',
            sv: 'Educational collaboration',
            en: 'Educational collaboration',
          },
        },
        {
          id: 'educationExport',
          label: 'educationExport',
          title: {
            fi: 'Koulutusvienti',
            sv: 'Export of Education',
            en: 'Export of Education',
          },
        },
        {
          id: 'studentMobility',
          label: 'studentMobility',
          title: {
            fi: 'Kansainvälinen opiskelijaliikkuvuus',
            sv: 'International student mobility',
            en: 'International student mobility',
          },
        },
        {
          id: 'staffMobility',
          label: 'staffMobility',
          title: {
            fi: 'Kansainvälinen henkilöstöliikkuvuus',
            sv: 'International faculty or staff mobility',
            en: 'International faculty or staff mobility',
          },
        },
        {
          id: 'jointDegree',
          label: 'jointDegree',
          title: {
            fi: 'Yhteistutkintoyhteistyö',
            sv: 'Joint or Double Degree',
            en: 'Joint or Double Degree',
          },
        },
        {
          id: 'branchCampus',
          label: 'branchCampus',
          title: {
            fi: 'Etäkampus',
            sv: 'Branch Campus',
            en: 'Branch Campus',
          },
        },
        {
          id: 'otherCollaboration',
          label: 'otherCollaboration',
          title: {
            fi: 'Muu',
            sv: 'Other',
            en: 'Other',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 12,
    surveyId: 1,
    parentId: null,
    priority: 11,
    title: {
      fi: 'Yhteistyön kesto',
      sv: 'Duration of collaboration',
      en: 'Duration of collaboration',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista yhteistyösi kesto kuukausina tämän hetkisen tiedon valossa',
      sv: '',
      en: 'Choose from among the alternatives, as far as is foreseen for now.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'shortDuration',
          label: 'shortDuration',
          title: {
            fi: '0-24kk',
            sv: '0-24 months',
            en: '0-24 months',
          },
        },
        {
          id: 'mediumDuration',
          label: 'mediumDuration',
          title: {
            fi: '24-60kk',
            sv: '24-60 months',
            en: '24-60 months',
          },
        },
        {
          id: 'longDuration',
          label: 'longDuration',
          title: {
            fi: 'Yli 60kk',
            sv: 'Over 60 months',
            en: 'Over 60 months',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 13,
    surveyId: 1,
    parentId: null,
    priority: 12,
    title: {
      fi: 'Sisältyykö yhteistyöhön ulkopuolista rahoitusta?',
      sv: 'Is external funding included in this collaboration?',
      en: 'Is external funding included in this collaboration?',
    },
    shortTitle: {
      fi: 'Ulkopuolista rahoitus',
      sv: 'External funding',
      en: 'External funding',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista, sen mukaan, onko tarkoitus hyödyntää yhteistyössä ulkopuolista rahoitusta',
      sv: '',
      en: 'Choose from among the alternatives based on whether utilising external funding is foreseen.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'externalFunding',
          label: 'externalFunding',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
          risk: 2,
        },
        {
          id: 'noExternalFunding',
          label: 'noExternalFunding',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
          risk: 0,
        },
      ],
    },
    visibility: {},
  },
  {
    id: 14,
    surveyId: 1,
    parentId: 13,
    priority: 0,
    title: {
      fi: 'Onko yksikkösi saanut aiemmin rahoitusta samalta rahoittajalta?',
      sv: 'Has your unit been previously funded by the same funder?',
      en: 'Has your unit been previously funded by the same funder?',
    },
    shortTitle: {
      fi: 'Aiempaa rahoitusta rahoittajalta?',
      sv: 'Has your unit been previously funded by the same funder?',
      en: 'Has your unit been previously funded by the same funder?',
    },
    text: {
      fi: 'Vastaa sen mukaan, onko yksikkösi saanut rahoitusta samalta rahoittajalta viimeisen viiden vuoden aikana.',
      sv: '',
      en: 'Choose from among the alternatives, according to whether your unit has received funding from the same funder during the past five years.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'previouslyFunded',
          label: 'previouslyFunded',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
          risk: 1,
        },
        {
          id: 'notPreviouslyFunded',
          label: 'notPreviouslyFunded',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
          risk: 2,
        },
      ],
    },
    visibility: { options: ['externalFunding'] },
  },
  {
    id: 15,
    surveyId: 1,
    parentId: 13,
    priority: 1,
    title: {
      fi: 'Pääasiallinen rahoittaja on',
      sv: 'Classification of the principal funder',
      en: 'Classification of the principal funder',
    },
    text: {
      fi: 'Valitse rahoittajatahoa parhaiten kuvaava vaihtoehto. Jos rahoittajia on useampia, valitse pääasiallista rahoittajaa kuvaava vaihtoehto.',
      sv: '',
      en: 'Select the alternative, which best describes the funder. In case there are several funders, select the alternative, which best describes the principal funder.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'finnishPublicEntity',
          label: 'finnishPublicEntity',
          title: {
            fi: 'Suomalainen julkisyhteisö (esim. ministeriö)',
            sv: 'Finnish public entity (e.g. ministry)',
            en: 'Finnish public entity (e.g. ministry)',
          },
          risk: 1,
        },
        {
          id: 'finnishFoundation',
          label: 'finnishFoundation',
          title: {
            fi: 'Suomalainen säätiö tai vastaava',
            sv: 'Finnish foundation or similar',
            en: 'Finnish foundation or similar',
          },
          risk: 1,
        },
        {
          id: 'finnishCompany',
          label: 'finnishCompany',
          title: {
            fi: 'Suomalainen yritys',
            sv: 'Finnish company',
            en: 'Finnish company',
          },
          risk: 2,
        },
        {
          id: 'otherFinnishFunder',
          label: 'otherFinnishFunder',
          title: {
            fi: 'Muu suomalainen taho',
            sv: 'Other Finnish funder',
            en: 'Other Finnish funder',
          },
          risk: 2,
        },
        {
          id: 'internationalPublicEntity',
          label: 'internationalPublicEntity',
          title: {
            fi: 'Ulkomainen julkisyhteisö (esim. EU, YK, ulkomainen ministeriö)',
            sv: 'International public entity (e.g. EU, UN, foreign ministry)',
            en: 'International public entity (e.g. EU, UN, foreign ministry)',
          },
          risk: 1,
        },
        {
          id: 'internationalFoundation',
          label: 'internationalFoundation',
          title: {
            fi: 'Ulkomainen säätiö tai vastaava',
            sv: 'International foundation or similar',
            en: 'International foundation or similar',
          },
          risk: 2,
        },
        {
          id: 'internationalCompany',
          label: 'internationalCompany',
          title: {
            fi: 'Ulkomainen yritys',
            sv: 'International company',
            en: 'International company',
          },
          risk: 2,
        },
        {
          id: 'otherInternationalFunder',
          label: 'otherInternationalFunder',
          title: {
            fi: 'Muu ulkomainen taho',
            sv: 'Other international funder',
            en: 'Other international funder',
          },
          risk: 2,
        },
      ],
    },
    visibility: { options: ['externalFunding'] },
  },
  {
    id: 16,
    surveyId: 1,
    parentId: null,
    priority: 13,
    title: {
      fi: 'Anna arvio yhteistyön taloudellisista kokonaisvastuista (sis. omarahoitus) yliopistolle sen kokonaiskeston aikana.',
      sv: 'Provide an estimate of the University’s financial responsibilities (including in-kind) of the collaboration for the duration of it.',
      en: 'Provide an estimate of the University’s financial responsibilities (including in-kind) of the collaboration for the duration of it.',
    },
    shortTitle: {
      fi: 'Taloudellinen kokonaisvastuu',
      sv: 'Financial responsibilities',
      en: 'Financial responsibilities',
    },
    text: {
      fi: 'Ilmoita hankkeen taloudellinen kokonaislaajuus sisältäen mahdollisen omarahoituksen',
      sv: '',
      en: 'Please indicated the overall financial scope of the collaoboration, including possible in-kind contribution.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'smallBudget',
          label: 'smallBudget',
          title: {
            fi: '0-200.000',
            sv: '0-200.000',
            en: '0-200.000',
          },
          risk: 1,
        },
        {
          id: 'mediumBudget',
          label: 'mediumBudget',
          title: {
            fi: '200.000-500.000',
            sv: '200.000-500.000',
            en: '200.000-500.000',
          },
          risk: 2,
        },
        {
          id: 'largeBudget',
          label: 'largeBudget',
          title: {
            fi: 'Yli 500.000',
            sv: 'Over 500.000',
            en: 'Over 500.000',
          },
          risk: 3,
        },
      ],
    },
    visibility: {},
  },
  {
    id: 17,
    surveyId: 1,
    parentId: null,
    priority: 14,
    title: {
      fi: 'Onko mahdollista, että yhteistyössä siirretään henkilötietoja yhteistyökumppanille?',
      sv: 'Does the collaboration require transferring personal data to the partner institution?',
      en: 'Does the collaboration require transferring personal data to the partner institution?',
    },
    shortTitle: {
      fi: 'Henkilötietojen siirto',
      sv: 'Does the collaboration require transferring personal data to the partner institution?',
      en: 'Does the collaboration require transferring personal data to the partner institution?',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista sen mukaan, että onko yhteistyösi aikana todennäköistä, että opiskelijoiden, henkilöstön tai yhteistyötahojen edustajien henkilötietoja joudutaan yliopiston toimesta siirtämään yhteistyökumppanille',
      sv: '',
      en: 'Choose from among the alternatives, based on whether it is likely that personal data of students,staff, faculty or extenral stakeholders will be transferred to your collaboration partner ',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'transferPersonalData',
          label: 'transferPersonalData',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
        },
        {
          id: 'noTransferPersonalData',
          label: 'noTransferPersonalData',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
        },
        {
          id: 'notSureTransferPersonalData',
          label: 'notSureTransferPersonalData',
          title: {
            fi: 'Ei tiedossa',
            sv: 'Not sure',
            en: 'Not sure',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 18,
    surveyId: 1,
    parentId: 9,
    priority: 0,
    title: {
      fi: 'Mikä muu rooli?',
      sv: '',
      en: 'Which other role?',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: { type: 'text', options: [] },
    visibility: { options: ['otherRole'] },
  },
  {
    id: 19,
    surveyId: 1,
    parentId: 11,
    priority: 0,
    title: {
      fi: 'Mikä muu yhteistyön muoto?',
      sv: '',
      en: 'Which other collaboration form?',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: { type: 'text', options: [] },
    visibility: { options: ['otherCollaboration'] },
  },
  {
    id: 20,
    surveyId: 1,
    parentId: 6,
    priority: 0,
    title: {
      fi: 'Yhteistyöyliopiston nimi',
      sv: '',
      en: 'Name of the partner university',
    },
    text: {
      fi: 'Valitse listasta yhteistyöyliopistosi nimi.',
      sv: '',
      en: 'Select your partner university from the list.',
    },
    optionData: {
      type: 'universitySelect',
      options: [],
      label: {
        fi: 'Valitse yliopisto',
        sv: 'Select university',
        en: 'Select university',
      },
    },
    visibility: { options: ['university'] },
  },
  {
    id: 21,
    surveyId: 1,
    parentId: 6,
    priority: 0,
    title: {
      fi: 'Yhteistyöyliopiston nimi',
      sv: '',
      en: 'Name of the partner university',
    },
    text: {
      fi: 'Kirjoita tähän yhteistyöyliopiston nimi, jos sitä ei löydy yllä olevasta listasta.',
      sv: '',
      en: 'In case the your university partner does not appear on the list above, please write the name of the institution here.',
    },
    optionData: { type: 'text', options: [] },
    visibility: { options: [] },
  },
  {
    id: 22,
    surveyId: 1,
    parentId: 6,
    priority: 1,
    title: {
      fi: 'Yhteistyöorganisaation nimi',
      sv: '',
      en: 'Name of the partner organisation',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: { type: 'organisationSelect', options: [] },
    visibility: {
      options: ['otherResearchOrg', 'company', 'ngo', 'otherType'],
    },
  },
  {
    id: 23,
    surveyId: 1,
    parentId: null,
    priority: 15,
    title: {
      fi: 'Onko mahdollista, että yhteistyössä siirtyy sotilaskäyttöön soveltuvaa teknologiaa tai osaamista kumppanille (vrt. Dual Use)?',
      sv: 'Does the collaboration require transferring technology or know-how with potential for military use (so-called Dual Use)?',
      en: 'Does the collaboration require transferring technology or know-how with potential for military use (so-called Dual Use)?',
    },
    shortTitle: {
      fi: 'Sotilaskäyttöön soveltuvaa teknologiaa',
      sv: 'Does the collaboration require transferring technology or know-how with potential for military use (so-called Dual Use)?',
      en: 'Does the collaboration require transferring technology or know-how with potential for military use (so-called Dual Use)?',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista sen mukaan, onko mahdollista, että yhteistyökumppanille siirtyy sotilaskäyttöön soveltuvaa teknologiaa tai osaamista',
      sv: '',
      en: 'Choose from among the alternatives, based on whether it is possible that military technology or related know-how will be transferred to your collaboration partner.',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'transferMilitaryKnowledge',
          label: 'transferMilitaryKnowledge',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
          risk: 3,
        },
        {
          id: 'noTransferMilitaryKnowledge',
          label: 'noTransferMilitaryKnowledge',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
          risk: 1,
        },
        {
          id: 'notSureTransferMilitaryKnowledge',
          label: 'notSureTransferMilitaryKnowledge',
          title: {
            fi: 'Ei tiedossa',
            sv: 'Not sure',
            en: 'Not sure',
          },
          risk: 2,
        },
      ],
    },
    visibility: {},
  },
  {
    id: 24,
    surveyId: 1,
    parentId: null,
    priority: 7,
    title: {
      fi: 'Onko yhteistyöorganisaation kanssa tehty onnistunutta yhteistyötä aiemmin?',
      sv: 'Has your unit collaborated successfully with the partner organisation before?',
      en: 'Has your unit collaborated successfully with the partner organisation before?',
    },
    shortTitle: {
      fi: 'Onko aiempaa yhteistyötä',
      sv: 'Has your unit collaborated successfully with the partner organisation before?',
      en: 'Has your unit collaborated successfully with the partner organisation before?',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista',
      sv: '',
      en: 'Choose from among the alternatives',
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'succefultCollaboration',
          label: 'successfulCollaboration',
          title: {
            fi: 'Kyllä',
            sv: 'Yes',
            en: 'Yes',
          },
        },
        {
          id: 'noSuccessfulCollaboration',
          label: 'noSuccessfulCollaboration',
          title: {
            fi: 'Ei',
            sv: 'No',
            en: 'No',
          },
        },
      ],
    },
    visibility: {},
  },
  {
    id: 25,
    surveyId: 1,
    parentId: null,
    priority: 19,
    title: {
      fi: 'Arvioi, sisältääkö yhteistyö eettisiä ongelmakohtia (ihmisoikeudet, tasa-arvo, yhdenvertaisuus) tai ristiriitaa yliopiston arvojen kanssa',
      sv: '',
      en: 'Assess if the collaboration includes ethical issues (human rights, equality) or conflicts with the values of the UH',
    },
    shortTitle: {
      fi: 'Ristiriitaa HY:n arvoihin',
      sv: '',
      en: 'Assess if the collaboration includes ethical issues (human rights, equality) or conflicts with the values of the UH',
    },
    text: {
      fi: 'Valitse annetuista vaihtoehdoista, perusta arviosi nykyisiin tietohisi ja käsitykseesi yliopiston arvoista ja eettisistä periaatteista',
      sv: '',
      en: "Choose from among the alternatives basing your assessment on current view of University's values and  ethical guidelines.",
    },
    optionData: {
      type: 'singleChoice',
      options: [
        {
          id: 'noEthicalIssues',
          label: 'noEthicalIssues',
          title: {
            fi: 'Ei missään tapauksessa',
            sv: '',
            en: 'Not in any case',
          },
          risk: 1,
        },
        {
          id: 'likelyNoEthicalIssues',
          label: 'likelyNoEthicalIssues',
          title: {
            fi: 'Melko varmasti ei',
            sv: '',
            en: 'Likely not',
          },
          risk: 1,
        },
        {
          id: 'maybeEthicalIssues',
          label: 'maybeEthicalIssues',
          title: {
            fi: 'Ehkä',
            sv: '',
            en: 'Maybe',
          },
          risk: 2,
        },
        {
          id: 'likelyEthicalIssues',
          label: 'likelyEthicalIssues',
          title: {
            fi: 'Melko varmasti',
            sv: '',
            en: 'Possibly',
          },
          risk: 3,
        },
        {
          id: 'ethicalIssues',
          label: 'ethicalIssues',
          title: {
            fi: 'Varmasti',
            sv: '',
            en: 'Certainly',
          },
          risk: 3,
        },
      ],
    },
    visibility: {},
  },
  {
    id: 26,
    surveyId: 1,
    parentId: 4,
    priority: 0,
    title: {
      fi: 'Valitse listasta kaikki ne erityisen riskin maat, jonka yliopistoja tai muita organisaatioita konsortioosi kuuluu.',
      sv: '',
      en: 'Select all applicable countries of especial risks, whose universities or other organisations belong to you consortium',
    },
    shortTitle: {
      fi: 'Konsortion erityisen riskin maat',
      sv: '',
      en: 'Select all applicable countries of especial risks, whose universities or other organisations belong to you consortium',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: {
      type: 'highRiskCountrySelect',
      options: [],
    },
    visibility: { options: ['multilateral'] },
  },
  {
    id: 27,
    surveyId: 1,
    parentId: 26,
    priority: 0,
    title: {
      fi: 'Valitse konsortioon kuuluvat maat',
      sv: '',
      en: 'Select countries that belong to the consortium',
    },
    shortTitle: {
      fi: 'Konsortioon kuuluvat maat',
      sv: '',
      en: 'Select countries that belong to the consortium',
    },
    text: {
      fi: '',
      sv: '',
      en: '',
    },
    optionData: {
      type: 'highRiskCountrySelect',
      options: [],
    },
    visibility: { options: [] },
  },
]

export default getQuestionData
