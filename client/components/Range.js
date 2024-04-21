'use client'
import { Slider } from "@mui/material";

function Range({ min, color, value, setValue, children, disabled, fixThumbSize }) {
  return (
    <div style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      margin:"1vh 3vw"
    }}>
      <p style={{
          width:"24%",
          margin: "-8px 0px 0px 0px",
          textAlign:"center",
          color: disabled?"#BBB":"",
          fontSize:"18px",
          fontWeight:500,
      }}>
          {min? parseInt(value) + min : parseInt(value)} {children}
      </p>
      <div style={{width:"76%", margin:"1vh 3vw"}}>
        <Slider
          disabled={disabled}
          size="small"
          sx={{
            '& .MuiSlider-thumb': {
              color: disabled?"#BBB":color,
              width: fixThumbSize? 16: 12+value/4,
              height: fixThumbSize? 16: 12+value/4,
              boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.16)",
              '&.Mui-active': {
                boxShadow: color=="#FFFFFF"?"":`0px 0px 0px 12px ${color}55`,
              },
            },
            '& .MuiSlider-track':{
              color:disabled?"#BBB":color,
              boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.16)",
            },
            '& .MuiSlider-rail':{
              color:disabled?"#BBB":color,
              boxShadow: "1px 1px 3px 1px rgba(0, 0, 0, 0.16)",
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
  )
}
export default Range;