// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { Entry, Result } from '@dbmodels'
import type { ControlReport } from '@dbmodels'

import ReactPdf from '@react-pdf/renderer'

import { Page, Text, View, Document } from '@react-pdf/renderer'

import { ComponentProvider } from '@resultRenderer/context'
import RiskTable from '@resultRenderer/RiskTable'
import RenderAnswers from '@resultRenderer/RenderAnswers'
import { FacultyOrUnit, RiskData } from '@types'
import i18n from '../util/i18n'
import { TFunction } from 'i18next'
import { DEFAULT_SURVEY_NAME, supportEmail } from '@config'
import { getWarnings } from '../services/warning'
import { getRiskParts } from '@common/getRiskParts'
import { ENTRY_STATE_LABELS, EntryState } from '@common/entryStates'

export const createPdfResultBuffer = async (entry: Entry) => {
  const t = i18n.getFixedT('en')

  const [results, countries, survey, faculties, units, warnings] = await Promise.all([
    getResults('1'),
    getCountries(),
    getSurvey(DEFAULT_SURVEY_NAME),
    getFaculties(),
    getUnits(),
    getWarnings(),
  ])

  const stream = await ReactPdf.renderToStream(
    <ResultDocument
      entry={entry.data}
      countries={countries}
      results={results}
      survey={survey}
      resultData={entry.data.answers}
      faculties={faculties}
      units={units}
      t={t}
      warnings={warnings}
      controlReports={((entry as any).controlReports ?? []).filter((r: ControlReport) => !r.adminOnly)}
      entryState={(entry as any).state ?? null}
      parts={getRiskParts(entry.data)}
    />
  )

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    stream.on('error', err => reject(err))
  })

  return buffer
}

type Country = {
  name: string
  iso2Code: string
}

const ResultDocument = ({
  entry,
  countries,
  results,
  survey,
  resultData,
  faculties,
  units,
  t,
  warnings,
  controlReports,
  entryState,
  parts,
}: {
  entry: RiskData
  countries: Country[]
  results: Result[]
  survey: any
  resultData: any
  faculties: FacultyOrUnit[]
  units: FacultyOrUnit[]
  t: TFunction
  warnings: any
  controlReports: ControlReport[]
  entryState: EntryState | null
  parts: string[]
}) => {
  const { country } = entry

  return (
    <Document
      title={t('pdf:subject')}
      author={t('pdf:author')}
      creator={t('pdf:creator')}
      producer={t('pdf:producer')}
      subject={t('pdf:subject')}
      language="en"
    >
      <Page size="A4" style={{ padding: '10px' }} wrap>
        <ComponentProvider
          components={{
            Div: View,
            Table: View,
            TableBody: View,
            Markdown,
            TableCell,
            TableContainer,
            TableRow,
            Typography: Text,
            t,
            language: 'en',
          }}
        >
          <View style={{ padding: '10px', fontSize: '10px' }}>
            {entryState && (
              <View style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Käsittelytoimenpiteet</Text>

                <Text style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Ylittyvät kynnysarvot</Text>
                {parts.map(p => (
                  <Text
                    key={p}
                    style={{ fontSize: '9px', marginLeft: '8px' }}
                  >{`\u2022 ${i18n.getFixedT('fi')(p)}`}</Text>
                ))}

                {entryState && (
                  <View style={{ marginTop: '8px' }}>
                    <Text style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Käsittelyn vaihe</Text>
                    <Text style={{ fontSize: '9px' }}>{i18n.getFixedT('fi')(ENTRY_STATE_LABELS[entryState])}</Text>
                  </View>
                )}

                {controlReports.length > 0 && (
                  <View style={{ marginTop: '8px' }}>
                    <Text style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                      Toimenpiteet ja kommentit
                    </Text>
                    {controlReports.map(report => (
                      <View key={report.id} style={{ marginBottom: '6px', padding: '6px', border: '1px solid #ccc' }}>
                        <Text style={{ fontSize: '8px', color: '#666', marginBottom: '4px' }}>
                          {`Luonut: ${report.createdBy}   Viimeksi päivitetty: ${new Date(report.createdAt).toLocaleDateString('fi')}`}
                        </Text>
                        <Text style={{ fontSize: '9px' }}>{report.text}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <RiskTable
              countries={countries}
              countryData={country[0]}
              riskData={entry}
              results={results}
              warnings={warnings}
            />
            <View style={{ padding: '10px' }} />
            <RenderAnswers survey={survey} resultData={resultData} faculties={faculties} units={units} />
          </View>
        </ComponentProvider>
        <Text fixed style={{ bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: '8px', paddingTop: '10px' }}>
          {t('pdf:footer', { appName: t('common:appName'), date: new Date().toLocaleDateString('fi') })}
        </Text>
        <Text style={{ fontSize: '8px', paddingTop: '10px', textAlign: 'center' }}>{supportEmail}</Text>
      </Page>
    </Document>
  )
}

const TableContainer = ({ style, children }) => (
  <View style={[{ display: 'flex', flexDirection: 'column', margin: '10px' }, style]}>{children}</View>
)

const TableRow = ({ style, children }) => (
  <View
    wrap={false}
    style={[
      {
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      },
      style,
    ]}
  >
    {children}
  </View>
)

const TableCell = ({ style, children }) => (
  <View
    wrap={false}
    style={[
      {
        flex: 1,
        padding: '5px',
      },
      style,
    ]}
  >
    {children}
  </View>
)

import ReactMarkdown from 'react-markdown'
import { getResults } from './result'
import { getCountries } from './countries'
import { getSurvey } from './survey'
import { getFaculties, getUnits } from './faculty'

const H1 = ({ ...rest }) => <Text {...rest} />

const H2 = ({ ...rest }) => <Text {...rest} />

const H3 = ({ ...rest }) => <Text {...rest} />

const H4 = ({ ...rest }) => <Text {...rest} />

const A = ({ ...rest }) => <Text {...rest} />

const Strong = ({ ...rest }) => <Text style={{ fontWeight: 800 }} {...rest} />

const Em = ({ ...rest }) => <Text style={{ fontStyle: 'italic' }} {...rest} />

const mdComponents = {
  p: Text,
  a: A,
  blockquote: Text,
  br: Text,
  code: Text,
  em: Em,
  h5: Text,
  h6: Text,
  hr: Text,
  img: Text,
  li: Text,
  ol: View,
  pre: Text,
  strong: Strong,
  ul: View,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
}

interface MarkdownProps {
  children: string
}

const Markdown = ({ children, ...props }: MarkdownProps) => {
  if (!children) {
    return null
  }

  // https://stackoverflow.com/questions/69026492/adding-multiple-line-break-in-react-markdown
  const content = children.replace(/\n/gi, '&nbsp; \n')

  return (
    <ReactMarkdown
      remarkPlugins={[]}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error xd
      components={mdComponents}
      linkTarget="_blank"
      {...props}
    >
      {content}
    </ReactMarkdown>
  )
}
