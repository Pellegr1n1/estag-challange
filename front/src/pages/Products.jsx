import Header from "../components/Header";
import FormInput from "../components/FormInput";
import styles from "../styles/products.module.css";
import styleTable from "../styles/tables.module.css";
import trash from "../assets/trash-fill.svg";
import pencil from "../assets/pencil-fill.svg";
import React, { useState, useEffect } from "react";
import Api from "../api/products.js";
import Message from "../components/Message.jsx"
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { GoAlert } from "react-icons/go";
function Products() {
    // Hooks
    const [listCategory, setListCategory] = useState([]);
    const [selectValue, setSelectValue] = useState();
    const [listProducts, setListProducts] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [modal, setModal] = useState(false);
    const [alert, setAlert] = useState(false);

    const [id, setId] = useState();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        Api.getAllCategory(setListCategory);
        Api.getAllProducts(setListProducts);
    }, [location.key]);

    const handleRegister = async (event) => {
        event.preventDefault();
        await Api.registerProduct(
            event.target.name.value,
            event.target.amount.value,
            event.target.price.value,
            selectValue,
            setMessage,
            setSuccess,
            navigate
        );

    }

    return (
        <div>
            <Header />
            <h1>Produtos</h1>
            <section className={styles.section}>
                <div className={styles.divForms}>
                    <form onSubmit={handleRegister} >
                        <FormInput type={'text'} placeholder={'Nome'} classe={'name'} name={'name'} id={styles.name} pattern={"[A-Za-zÀ-ú\s]+"} msg={"Digite apenas letras!"} />
                        <div className={styles.divInput}>
                            <FormInput type={'number'} placeholder={'Quantidade'} classe={'amount'} name={'amount'} min={1} pattern={"^[1-9]\d*$"} />
                            <FormInput type={'number'} placeholder={'Preço'} classe={'price'} name={'price'} min={0.1} />
                            <select defaultValue={""} className={"category"} onChange={event => setSelectValue(event.target.value)} required>
                                <option value={""} disabled>Categoria</option>
                                {listCategory.map(item => (
                                    <option key={item.code} value={item.code} >{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <FormInput type={'submit'} value={'Registrar Produto'} classe={'btnAdd'} id={styles.btn} />
                        <div className={styles.divButtonsEdit}>
                            <input type="button" className="btn_edit" id={styles.btnEdit} value="Salvar" style={{ display: 'none' }} />
                            <input type="button" className="btn_cancel" id={styles.btnCancel} value="Cancelar" style={{ display: 'none' }} />
                        </div>
                    </form>
                </div>
                <div className={styles.divTable}>
                    <table className={styleTable.table}>
                        <tbody>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Categoria</th>
                                <th>Editar</th>
                                <th>Deletar</th>
                            </tr>
                            {
                                listProducts.map(item => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.amount}</td>
                                        <td>R${item.price}</td>
                                        <td>{item.name_category}</td>
                                        <td><img src={pencil} onClick={() => {
                                            Api.editAmound(item.code, setMessage, setSuccess, navigate, setAlert)
                                        }}></img></td>
                                        <td><img src={trash} alt="deletar" onClick={() => {
                                            setModal(true);
                                            setId(item.code);
                                        }} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </section>
            <div className={styles.message}>
                {success && <Message text={message} type={'success'} />}
                {error && <Message text={message} type={'error'} />}
                {alert && <Message text={message} type={'alert'} />}

            </div>
            <div className={styles.divModal}>
                <Modal type={'alert'} isOpen={modal} btnClose={() => { setModal(!modal) }} btnYes={() => {
                    setModal(!modal),
                        Api.deleteProduct(id, setError, setMessage, setSuccess, navigate);
                }} >
                    <div className={styles.modal}>
                        <GoAlert size={30} color="#ff8800" style={{ margin: '0px 0px 20px' }} />
                        <p>Deseja realmente excluir o produto?</p>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Products