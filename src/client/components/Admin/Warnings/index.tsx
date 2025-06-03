import useWarnings from 'src/client/hooks/useWarnings'
//import { useComponents } from "@resultRenderer/context"

//import useCountries from "src/client/hooks/useCountries"

const WarningObject = ({ country, text }) => {
  //const { countries } = useCountries()

  return (
    <p>
      {country} {text.fi} {text.en}
    </p>
  )
}

const RenderWarnings = () => {
  const { warnings } = useWarnings()

  if (!warnings) return null

  return (
    <div>
      <p>Test</p>
      <p></p>
      {warnings.map(({ country, text }) => (
        <ul key={country}>
          {' '}
          <WarningObject country={country} text={text} />{' '}
        </ul>
      ))}
    </div>
  )
}

export default RenderWarnings
