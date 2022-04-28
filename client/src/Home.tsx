import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

import logo from "./assets/logo.svg";
import CardState, { CardContext } from "./context/State";

import styles from "./Home.module.css";
import { Products } from "./Products";

const socket = io("http://localhost:3001");

const Home: React.FC = () => {

  const [lista, setLista] = useState('')
  const [input, setInput] = useState('')
  const [votacion, setVotacion] = useState({})
  const [cardProduct, setcardProduct] = useState({})
  const [percentage, setPercentage] = useState({})
  const [btnState, setBtnState] = useState(false)

  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const search = () => {
      fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${input}&limit=5`)
      .then(res => res.json())
      .then(obj => setLista(obj.results))
    }
    search()

  }
  
  /*SOCKET-SOCKET-SOCKET-SOCKET-SOCKET-SOCKET-SOCKET*/


  useEffect(() => {
    socket.emit('connection')
    
    socket.on('vote', candidates => {
      setVotacion(candidates)
      console.log(votacion.voteA);
    })

    socket.on('item', products => {
      setcardProduct(products)
    })

    socket.on('percentage', percentages => {
      setPercentage(percentages)
    })

    socket.on('pause', btnState => {
      setBtnState(btnState)
    })

    
  },[socket])


  /*HANDLERS-HANDLERS-HANDLERS-HANDLERS-HANDLERS-HANDLERS-*/

  const reset = () => {
    socket.emit('reset')
  }

  const pausa = () => {
    socket.emit('pause', btnState)
  }

  const selectItem = (clientProduct) => {
    socket.emit('loadProduct', clientProduct)

  }

  const vote = (index: number) => {
    if(btnState === false) {
      socket.emit('vote', index)
    }
  }




  useEffect(() => {
    setPercentage({perA: votacion.voteA / (votacion.voteA + votacion.voteB ) * 100 , perB: votacion.voteB / (votacion.voteA + votacion.voteB ) * 100 })

  },[votacion])
 




  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>
          <img alt="RealTrends" src={logo} width={180} />
        </h1>
        <h3>Lets get this party started</h3>
      </header>


      <form className={styles.form} onSubmit={handleSearch}>
            <input placeholder='Seleccione producto A' onChange={handleInput} value={input} />
        </form>

        {
          lista && <div className={styles.searcherContainer}>
            {
              lista.map((product) => (
              <div key={product.id} onClick={() => selectItem(product)} >
                <Products img={product.thumbnail} title={product.title} price={product.price}/>
              </div>))
            }
          </div>
        }

      <div className={styles.containerApp}>



        <div className={styles.controls}>
          <button onClick={reset}>RESET</button>
          <button onClick={pausa}>PAUSA/REANUDAR</button>
        </div>

        <div className={`${ btnState ? styles.stop : ''  }`}>{ btnState && <h1>VOTACIÓN EN PAUSA</h1>}</div>
      <div className={styles.wrapper}>
        <div className={styles.full}>
          <div className={styles.percentage} style={{ height: `${percentage.perA}%`, backgroundColor: `hsl(${percentage.perA}, 100%, 50%)`}} ></div>
            <div className={styles.card}>
            
                <h1>{cardProduct.productA?.title ? cardProduct.productA?.title : 'Product A title'}</h1>
                <h3>{cardProduct.productA?.description ? cardProduct.productA?.description : 'Product A description'}</h3>
                <div className={styles.imageContainer} onClick={() => vote(0)} >
                  <img src={`${cardProduct ? cardProduct.productA?.image : ''  }`}/>
                </div>
                <p>{votacion ? votacion.voteA : '0'} voto(s)</p>
                <div className={styles.msgBox}>
                  <div className={styles.msgBoxMessage}></div>
                  <form className={styles.msgBoxForm}>
                    <input placeholder="Escribe tu mensaje" />
                  </form>
                </div>
                
            </div>
          </div>
          
          

        
          <div className={styles.full}>
          <div className={styles.percentage}  style={{ height: `${percentage.perB}%`, backgroundColor: `hsl(${percentage.perB}, 100%, 50%)`}} ></div>
            <div className={styles.card}>

              <h1>{cardProduct.productB?.title ? cardProduct.productB?.title : 'Product B title'}</h1>
              <h3>{cardProduct.productB?.description ? cardProduct.productB?.description : 'Product B description'}</h3>
              <div className={styles.imageContainer} onClick={() => vote(1)}>
              <img src={`${cardProduct ? cardProduct.productB?.image : ''  }`}/>
              </div>
              <p>{votacion.voteB > 0 ? votacion.voteB : '0'}  voto(s)</p>
              <div className={styles.msgBox}></div>
            </div>
            </div>
          </div>
      </div>




    </main>
  );
};

export default Home;
