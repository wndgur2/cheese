import paymentStyle from "./payment.module.css";

export default function Payment() {
  const payments = [
    {
      createdAt: "2023년 8월 3일 12:53",
      branch: "중앙대 안성캠점",
      isCapture : true,
      amount : 5,
      cost : 2000
    },{
      createdAt: "2022년 5월 1일 11:11",
      branch: "한경대 안성캠점",
      isCapture : false,
      amount : 3,
      cost : 3000
    },{
      createdAt: "2022년 5월 1일 11:10",
      branch: "한경대 안성캠점",
      isCapture : false,
      amount : 5,
      cost : 5000
    },{
      createdAt: "2021년 8월 3일 12:53",
      branch: "중앙대 안성캠점",
      isCapture : true,
      amount : 5,
      cost : 2000
    },{
      createdAt: "2020년 5월 1일 11:11",
      branch: "한경대 안성캠점",
      isCapture : false,
      amount : 3,
      cost : 3000
    },{
      createdAt: "2002년 5월 1일 11:10",
      branch: "한경대 안성캠점",
      isCapture : false,
      amount : 5,
      cost : 5000
    },
  ]
  return (
    <div>
      {payments.map(
        (v, i)=>
          <div key={i} className={paymentStyle.payment}>
            <div>
              <span className={paymentStyle.createdAt}>{v.createdAt}</span>
              <span className={paymentStyle.branch}>{v.branch}</span>
            </div>
            <div>
              <span className={paymentStyle.isCapture}>{v.isCapture?"촬영":"인화"}</span>
              <span className={paymentStyle.amount}>{v.amount}장</span>
              <span className={paymentStyle.cost}>{v.cost}원</span>
            </div>
          </div>
      )
      }
    </div>
  )
}
  