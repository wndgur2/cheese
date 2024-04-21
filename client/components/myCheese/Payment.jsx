import paymentStyle from "./payment.module.css";

export default function Payment({payments, branches}) {
  return (
    <div>
      {payments? payments.map((v, i)=>
        <div key={i} className={paymentStyle.payment}>
          <div>
            <span className={paymentStyle.createdAt}>{new Date(v.createdAt).toUTCString().split(' ').slice(0, 4).join(' ')}</span>
            <span className={paymentStyle.branch}>{
              branches.map((b)=>{
                if(b.branchId == v.branchId) return b.name;
              }).join('')
            }</span>
          </div>
          <div>
            <span className={paymentStyle.isCapture}>{v.photoOrPrint?"촬영":"인화"}</span>
            <span className={paymentStyle.amount}>{v.amount}장</span>
            <span className={paymentStyle.cost}>{v.cost}원</span>
          </div>
        </div>
      ) :
        <div style={{
          width:"100vw",
          textAlign:"center",
          fontSize:"4vw",
          fontWeight:400,
          color:"#888",
          margin:"5vh 0px 5vh 0px",
        }}>
          아직 결제한 내역이 없어요
        </div>
      }
    </div>
  )
}
  