import React from "react";
import styles from "../styles/message.module.css"
import { GoCheckCircle } from "react-icons/go";
import { GoXCircle } from "react-icons/go";
import { GoAlert } from "react-icons/go";
function Message({ text, type }) {
    return (
        <div className={`${styles[type]} ${styles.message}`}>
            <div className={styles.icon}>
            {type == 'success' ? <GoCheckCircle /> : type == 'error' ? <GoXCircle /> :  <GoAlert/>}</div>
            {text}
        </div>
    )
}

export default Message