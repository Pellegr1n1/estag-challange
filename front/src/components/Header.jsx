import React, { useState } from 'react';
import styles from '../styles/header.module.css';
import { SlMenu } from "react-icons/sl";
import SideBar from './SideBar.jsx';
function Header() {

    const [active, setActive] = useState(false);
    const [sideIn, setSideIn] = useState('');
    const [sideOut, setSideOut] = useState(false);

    return (
        <header>
            <h2 id={styles.title}>Suite Store</h2>
            {
                active ? <SlMenu id={styles[sideIn]} onClick={() => {
                    setTimeout(() => setActive(!active), 900),
                        setSideOut(true);
                }} />
                    : <SlMenu size={16} onClick={() => {
                        setActive(true),
                            setSideIn('sideIn');
                        setSideOut(false);
                    }} />
            }

            {
                active && <SideBar sideOut={sideOut} />
            }
        </header>

    )
}

export default Header