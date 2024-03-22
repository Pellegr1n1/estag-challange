import styles from "../styles/formInput.module.css"

function FormInput({ type, name, placeholder, pattern, value, msg, id, disabled, onClick, min, classe }) {
    return (
        <>
            <input
                type={type}
                name={name}
                min={min}
                placeholder={placeholder}
                required
                disabled={disabled}
                pattern={pattern}
                value={value}
                className={`${styles[type]} ${classe}`}
                id={id}
                title={msg}
                onClick={onClick}
            />
        </>
    )
}

export default FormInput