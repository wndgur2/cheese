import styles from "./input.module.css";

function Input({ value, src, name, type, children, onChange, maxLength }) {
    return (
        <div style={{
            borderRadius:"30px",
            backgroundColor: "#F5F5F5",
            borderRadius: "30px",
            display:"flex",
            marginBottom:"2vh",
            padding: "2vh",
            alignItems:"center"
        }}>
            <img style={{marginLeft:20}} src={src} width={24} height={24} />
            <input className={styles.b}
                placeholder={children}
                name = {name}
                type = {type}
                onChange= {onChange}
                maxLength={maxLength}
                value={value}
            />
        </div>
    )
}
export default Input;