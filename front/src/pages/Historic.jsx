import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import styles from "../styles/historic.module.css"
import stylesTable from "../styles/tables.module.css"
import Modal from "../components/Modal.jsx"
import eye from "../assets/eye-fill.svg"
import Api from "../api/historic.js"
import { GoChecklist } from "react-icons/go";
function Historic() {
    const [listOrder, setOrder] = useState([]);
    const [listItemOrder, setListItemOrder] = useState([]);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        Api.getOrders(setOrder);
    }, [])

    return (
        <div>
            <Header />
            <h1>Histórico</h1>
            <section className={styles.section}>
                <div className={styles.divTable}>
                    <table className={stylesTable.table}>
                        <tbody>
                            <tr>
                                <th>Código</th>
                                <th>Taxa</th>
                                <th>Total</th>
                                <th>Ver</th>
                            </tr>
                            {
                                listOrder.map((item) => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>R$ {item.tax}</td>
                                        <td>R$ {item.total}</td>
                                        <td><img src={eye} alt="view" onClick={() => {
                                            Api.getItemOrder(item.code, setListItemOrder)
                                            setModal(true)
                                        }} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </section>
            <div className={styles.divModal}>
                <Modal isOpen={modal} btnClose={() => { setModal(!modal) }} type={'historic'}>
                    <div className={styles.modal}>
                        <GoChecklist size={30} color="green" style={{ margin: '0px 0px 20px' }} />
                        <table className={stylesTable.table} id={styles.table}>
                            <tbody>
                            <tr>
                                <th>Código</th>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Taxa</th>
                                <th>Total</th>
                            </tr>
                            {
                                listItemOrder.map((item) => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.name_category}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.price}</td>
                                        <td>{item.tax}</td>
                                        <td>{item.total}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Historic