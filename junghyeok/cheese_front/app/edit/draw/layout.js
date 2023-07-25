'use client';
export default function DrawLayout({children}) {
    return (
        <div style={{height:"100%"}}>
            <div style={{height:"70%", margin:0}}>   
                {children}
            </div>
        </div>
  )
}
