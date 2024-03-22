import React from "react";
import styles from "../styles/modal.module.css"
import { IoMdClose } from "react-icons/io";

function Modal({ isOpen, children, btnClose, btnYes, type }) {
    if (isOpen) {
        return (
            <div className={styles.background}>
                <div className={styles[type]}>
                    {type == 'historic' && <IoMdClose id={styles.iconClose} size={20} onClick={btnClose}/>}
                    <div>
                        {children}
                    </div>
                    <div className={`${styles.divBtn}`} id={styles[type]}>
                        <button onClick={btnClose} id={styles.btnNo}>Não</button>
                        <button onClick={btnYes} id={styles.btnYes}>Sim</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Modal