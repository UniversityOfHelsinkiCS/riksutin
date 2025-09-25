// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { riskColors } from './common'
import { useComponents } from './context'

export interface RiskElementProps {
  infoText?: string | null | undefined
  title: string
  level: number | null | undefined
  style?: any
  ekstra?: string
}

const RiskElement = ({ infoText, title, level, style, ekstra }: RiskElementProps) => {
  const { Div, Markdown, Typography, t } = useComponents()
  if (!level) {
    return null
  }

  return (
    <Div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid lightgray',
      }}
    >
      <Div style={{ width: '30%', padding: '10px' }}>
        <Div style={style}>
          <Markdown>{t(title)}</Markdown>
        </Div>
      </Div>
      <Div style={{ padding: '10px' }}>
        <Div
          style={{
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: riskColors[level],
          }}
        >
          <Typography>{level > 3 ? '?' : level}</Typography>
        </Div>
      </Div>
      {infoText && (
        <Div style={{ width: '90%', padding: '10px' }}>
          <Markdown>{infoText}</Markdown>
          {ekstra && (
            <div style={{ marginTop: 20 }}>
              <Markdown>{ekstra}</Markdown>
            </div>
          )}
        </Div>
      )}
    </Div>
  )
}

export default RiskElement
