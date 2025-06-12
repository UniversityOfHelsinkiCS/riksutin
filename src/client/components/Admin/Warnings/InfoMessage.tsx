const ErrorMessage = ({ text }) => {
  return (
    <div>
      {text && (
        <div
          style={{
            backgroundColor: ' #5bc3a2',
            margin: '5px',
            borderRadius: '5px',
          }}
        >
          <p style={{ color: 'white', fontSize: '30px', padding: '10px' }}>
            <span style={{ marginLeft: '20px', fontSize: '30px' }}>&#10006;</span> {text}
          </p>
        </div>
      )}
    </div>
  )
}

export default ErrorMessage
