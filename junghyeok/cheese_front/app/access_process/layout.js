export default function AccessProcessLayout({ children }) {
  return (
      <div
        className="container"
        style={{
          overflowY:"scroll",
          height:"100vh",
          backgroundColor:"#FEFBF6",
          paddingTop:"7vh",
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