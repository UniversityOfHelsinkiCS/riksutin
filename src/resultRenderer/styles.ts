const cardStyles = {
  card: {
    mx: 2,
    transition: '0.3s',
    textAlign: 'left',
  },
  helloBox: {
    m: 2,
    maxWidth: 1560,
  },
  expendableBox: {
    my: 2,
    mx: 2,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.3,
  },
  outerBox: {
    maxWidth: 1560,
    border: 1,
    borderColor: 'grey.300',
  },
  questionsContainer: {
    my: 4,
    pl: 4,
    borderLeft: 1,
    textAlign: 'left',
    borderColor: 'grey.300',
  },
  content: {
    mt: 2,
    mb: 2,
    textAlign: 'left',
  },
  heading: {
    fontWeight: '200',
    pb: 1,
  },
  nestedSubSection: {
    fontWeight: '200',
    mt: 4,
    mx: 1,
    textAlign: 'left',
  },
  inputField: {
    width: '100%',
  },
}

const formStyles = {
  formWrapper: {
    my: 2,
    maxWidth: 1560,
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  choiceBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.3,
  },
  stackBox: { textAlign: 'center' },
  stackBoxWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    my: 2,
  },
  stack: {
    textAlign: 'center',
    mt: 2,
  },
}

const resultStyles = {
  card: {
    margin: 2,
    transition: '0.3s',
    textAlign: 'left',
    width: '80%',
  },
  resultElementWrapper: {
    marginTop: 4,
    marginBottom: 4,
    borderLeft: 1,
    borderColor: 'grey.400',
  },
  resultWrapper: {
    margin: 2,
  },
  heading: {
    fontWeight: '200',
    textAlign: 'left',
    paddingBottom: '30px',
  },
  tableCell: {
    borderRadius: '25%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBox: {
    borderLeft: 1,
    margin: '15px',
    paddingLeft: '10px',
  },
}

const footerStyles = {
  supportBox: {
    p: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '1rem',
  },
}

const common = {
  alertStyle: {
    width: 'auto',
    borderRadius: '10px',
    fontSize: '1rem',
  },
}

const riskColors: any = {
  1: '#2ecc71',
  2: '#f1c40f',
  3: '#e74c3c',
}

export default {
  cardStyles,
  formStyles,
  common,
  footerStyles,
  resultStyles,
  riskColors,
}
