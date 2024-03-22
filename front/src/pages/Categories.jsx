import Header from "../components/Header";
import FormInput from "../components/FormInput";
import styles from "../styles/categories.module.css";
import styleTable from "../styles/tables.module.css"
import Api from "../api/category.js";
import trash from "../assets/trash-fill.svg"
import React, { useState, useEffect } from "react";
import Message from "../components/Message.jsx";
import Modal from "../components/Modal.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { GoAlert } from "react-icons/go";
function Categories() {
    const [listCategory, setListCategory] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [modal, setModal] = useState(false);
    const [id, setId] = useState();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        Api.getAllCategory(setListCategory)
    }, [location.key]);



    const handleRegister = async (event) => {
        event.preventDefault();
        await Api.registerCategory(event.target.category.value,
            event.target.tax.value,
            setSuccess,
            setMessage,
            navigate);
    }

    return (
        <div>
            <Header />
            <section className={styles.section}>
                <h1>Categorias</h1>
                <div className={styles.forms}>
                    <form onSubmit={handleRegister}>
                        <FormInput type={'text'} name={'category'} placeholder={'Categoria'} pattern="[A-Za-zÀ-ú\s]+" msg={"Digite apenas letras!"} />
                        <FormInput type={'text'} name={'tax'} placeholder={'Taxa'} pattern="^(100(\.0+)?|\d{1,2}(\.\d+)?)$" msg={"Digite apenas números de 0 a 100"} />
                        <FormInput type={'submit'} value={'Registrar'} id={styles.btn} />
                    </form>
                </div>
                <div className={styles.divTable}>
                    <table className={styleTable.table}>
                        <tbody>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Taxa</th>
                                <th>Deletar</th>
                            </tr>
                            {listCategory.map(item => (
                                <tr key={item.code}>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{item.tax}%</td>
                                    <td><img src={trash} alt="deletar" onClick={() => {
                                        setModal(true);
                                        setId(item.code);
                                    }
                                    } /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <div className={styles.message}>
                {success && <Message text={message} type={'success'} />}
                {error && <Message text={message} type={'error'} />}
            </div>
            <div className={styles.divModal}>
                <Modal type={'alert'} isOpen={modal} btnClose={() => setModal(!modal)} btnYes={() => { 
                    setModal(!modal), Api.deleteCategory(id, setMessage, setError, setSuccess, navigate) }}>
                    <div className={styles.modal}>
                        <GoAlert size={30} color="#ff8800" style={{ margin: '0px 0px 20px' }} />
                        <p>Deseja realmente excluir a categoria?</p>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Categories