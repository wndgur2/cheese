'use client';

function Item({src, handleClick}){
    return (
        <td style={{
            padding: "2px 4px",
            width: "33%",
        }}>
            <div
                onClick={handleClick}
                style={{
                    display:"flex",
                    justifyContent:"center",
            }}>
                <img src={src} width="100%" style={{
                    border:"solid",
                    borderWidth:"1px",
                    objectFit: "cover",
                    height:"100%",
                    borderRadius: "12px",
                }}/>
            </div>
        </td>
    )
}
export default Item;