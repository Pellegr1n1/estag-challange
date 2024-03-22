import { Link } from 'react-router-dom'
import styles from '../styles/sideBar.module.css'
import { FaTag } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";

function SideBar({sideOut}) {
    return (
        <div className={`${styles.menu} ${styles[sideOut]}`}>
            <nav>
                <Link to={'/products'}><FaShoppingBasket color="yellow" style={{ margin: '0px 10px 0px 0px' }} />Produtos</Link>
                <Link to={'/categories'}><FaTag color="orange" style={{ margin: '0px 10px 0px 0px' }} />Categorias</Link>
                <Link to={'/'}><FaShoppingCart color="#00B930" style={{ margin: '0px 10px 0px 0px' }} />Carrinho</Link>
                <Link to={'/historic'}><FaHistory color="#3377FF" style={{ margin: '0px 10px 0px 0px' }} />Histórico</Link>
            </nav>
        </div>
    )
}

export default SideBar