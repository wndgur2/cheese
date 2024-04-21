'use client'

function ItemList({children}){
    return (
        <table style={{
            borderCollapse: "collapse",
        }}>
            <tbody> 
                {children}
            </tbody>
        </table>
    )
}
export default ItemList;