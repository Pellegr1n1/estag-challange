import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import trash from "../assets/trash-fill.svg";
import Header from "../components/Header"
import FormInput from "../components/FormInput"
import styles from "../styles/home.module.css"
import Message from "../components/Message.jsx";
import styleTable from "../styles/tables.module.css"
import Modal from "../components/Modal.jsx";
import Api from "../api/home.js"
import { GoAlert } from "react-icons/go";


function Home() {
    //states
    const [listProduct, setProducts] = useState([]);
    const [dataProduct, setDataProduct] = useState([]);
    const [selectValue, setSelectValue] = useState();
    const [localStorageList, setLocalStorageList] = useState([]);
    const [success, setSuccess] = useState();
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [modal, setModal] = useState(false);
    // refs
    const inputRefTax = useRef(null);
    const inputRefPrice = useRef(null);
    const inputRefTaxTotal = useRef(null);
    const inputRefTotal = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        Api.getAllProducts(setProducts);
        setLocalStorageList(Api.getLocalStorage());
        inputRefTaxTotal.current.value = Api.setTax();
        inputRefTotal.current.value = Api.setTotal();
    }, [location.key]);


    const handleRegister = (e) => {
        e.preventDefault();
        Api.addProductList(
            listProduct,
            selectValue,
            inputRefTax.current.value,
            e.target.amount.value,
            inputRefPrice.current.value,
            setMessage,
            setAlert,
            setSuccess,
            navigate);
           
    }

    const handleFinish = async (e) => {
        e.preventDefault();
        if(localStorage.length == 0){
            setMessage('Adicione um produto no seu carrinho!');
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            },2000)
        }else{
            e.target.disabled = true;
            var order = Api.createOrder(inputRefTaxTotal.current.value, inputRefTotal.current.value)
            await Api.updateProduct(order);
            await Api.postOrder(order, setMessage, setSuccess);
        }
    }

    return (
        <div>
            <Header />
            <h1>Carrinho</h1>
            <section className={styles.sectionLeft}>
                <div className={styles.form}>
                    <form onSubmit={handleRegister}>
                        <select required name="product" id={styles.product} defaultValue={""} onChange={e => {
                            setSelectValue(e.target.value)
                            Api.setDataProductById(listProduct, e.target.value, setDataProduct)

                        }} onClick={() => {
                            inputRefTax.current.value = dataProduct['tax'] == undefined ? "" : dataProduct['tax']
                            inputRefPrice.current.value = dataProduct['price'] == undefined ? "" : dataProduct['price']
                        }}>
                            <option value={""} disabled>Selecione</option>
                            {listProduct.map((item) => (
                                <option key={item.code} value={item.code}>{item.name}</option>
                            ))}
                        </select>
                        <div className={styles.inputs}>
                            <FormInput name={'amount'} type={'number'} placeholder={'Quantidade'} min={1} pattern={"^[1-9]\d*$"} />
                            <input type="text" ref={inputRefTax} placeholder="Taxa" disabled />
                            <input type="text" ref={inputRefPrice} placeholder="Preço" disabled />
                        </div>
                        <FormInput type={'submit'} value={'Adicionar Produto'} id={styles.btn} />
                    </form>
                </div>
            </section>
            <section className={styles.sectionRight}>
                <div className={styles.divTable}>
                    <table className={styleTable.table} id={styles.table}>
                        <tbody>
                            <tr>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                                <th>Deletar</th>
                            </tr>
                            {
                                localStorageList.map((item) => (
                                    <tr key={item.code}>
                                        <td>{item.name}</td>
                                        <td>R$ {item.price}</td>
                                        <td>{item.amount}</td>
                                        <td>R$ {item.total}</td>
                                        <td><img src={trash} alt="Deletar" onClick={() => Api.deleteItemStorage(item.code)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className={styles.divTaxTotal}>
                    <label>Taxa</label>
                    <input type={'text'} ref={inputRefTaxTotal} disabled={true} />
                    <label>Total</label>
                    <input type={'text'} ref={inputRefTotal} disabled={true} />
                </div>
                <div className={styles.divBtnCancelFinish}>
                    <FormInput type={'submit'} id={styles.btnCancel} value={'Cancelar'} onClick={() => setModal(true)} />
                    <FormInput type={'submit'} id={styles.btnFinish} value={'Finalizar'} onClick={(e) => handleFinish(e)} />
                </div>
            </section>
            <div className={styles.message}>
                {success && <Message text={message} type={'success'} />}
                {alert && <Message text={message} type={'alert'} />}
            </div>
            <div className={styles.divModal}>
                <Modal isOpen={modal} btnClose={() => { setModal(!modal) }} btnYes={() => Api.cancelar()} type={'alert'} >
                    <div className={styles.modal}>
                        <GoAlert size={30} color="#ff8800" style={{ margin: '0px 0px 20px' }} />
                        <p>Deseja realmente cancelar a compra?</p>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Home