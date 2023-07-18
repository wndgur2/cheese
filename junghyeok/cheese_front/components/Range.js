'use client'
import { Slider } from "@mui/material";

function Range({ value, setValue, children, disabled }) {
    return (
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        margin:"1vh 5vw"
      }}>
        <p style={{
            width:"18%",
            margin:0,
            textAlign:"center",
            color: disabled?"#BBB":"",
        }}>
            {parseInt(value)} {children}
        </p>
        <div style={{width:"85%", marginTop:"1vh"}}>
          <div style={{width:"100%", margin:"0px 2vw"}}>
            <Slider
              disabled={disabled}
              size="small"
              sx={{
                '& .MuiSlider-thumb': {
                  color: disabled?"#BBB":"#FFC121",
                  width:12+value/4,
                  height:12+value/4,
                  '&.Mui-active': {
                    boxShadow: `0px 0px 0px 12px #FFC12155`,
                  },
                },
                '& .MuiSlider-track':{
                  color:disabled?"#BBB":"#FFC121"
                },
                '& .MuiSlider-rail':{
                  color:disabled?"#BBB":"#FFC121"
                },
              }}
              value={value}
              onChange={event =>{
                setValue(event.target.value)
              }}
              defaultValue={value}
            ></Slider>
          </div>
        </div>
      </div>
    )
}
export default Range;