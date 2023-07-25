export default function AccessProcessLayout({ children }) {
  return (
      <div
        style={{
          overflowY:"scroll",
          height:"100vh",
          backgroundColor:"#FEFBF6",
        }}
      >
          {children}
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>
  )
}