import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

import logo from "./assets/logo.svg";
import CardState, { CardContext } from "./context/State";

import styles from "./Home.module.css";
import { Products } from "./Products";
import { ICard, IProduct } from '../interfaces/IProduct';
import { IoReloadOutline,IoPauseOutline } from 'react-icons/io5'
import { useSnackbar } from 'notistack'
import { FilterPages } from "./components/FilterPages";




type cardProduct = {
  
  productA?: ICard;
  productB?: ICard;
}

type percentage = {
  perA?: number;
  perB?: number;
}

type votacion = {
  voteA?: number;
  voteB?: number;
}


type propsForSearch = {
  img:string;
  title: string;
  price:number;
}

const socket = io("https://realtrend-challenge.herokuapp.com");

const Home: React.FC = () => {

  const [lista, setLista] = useState < IProduct[] | null | []>([])
  const [input, setInput] = useState('')
  const [votacion, setVotacion] = useState<votacion | null>(null)
  const [cardProduct, setcardProduct] = useState<cardProduct | null>({
    productA: {
    image:'',
    title:'',
    description:''
  },
  productB: {
    image:'',
    title:'',
    description:''
  },
})
  const [percentage, setPercentage] = useState<percentage | null>({perA:0, perB:0})
  const [btnState, setBtnState] = useState(false)
  const [btnPage, setBtnPage] = useState(0)

  const { enqueueSnackbar } = useSnackbar();

  const voteValidator = ( cardProduct?.productA?.image === '' ) && ( cardProduct?.productB?.image === '' )

  useEffect(() => {
    console.log(`
    ██╗     ███╗   ███╗   
    ██║     ████╗ ████║   
    ██║     ██╔████╔██║   
    ██║     ██║╚██╔╝██║   
    ███████╗██║ ╚═╝ ██║██╗
    ╚══════╝╚═╝     ╚═╝╚═╝
                          
    `)
    console.log('%c Happy Coding! 👻', 'color: white; background-color: black; padding:10px; border-radius:5px;font-family:sans-serif;font-size:14px;');
  },[])
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const search = () => {
      fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${input}&limit=16`)
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

    })

    socket.on('item', products => {
      setcardProduct(products)
    })

    socket.on('percentage', percentages => {
      setPercentage(percentages)
    })

    socket.on('pause', btnState => {
      setBtnState(btnState)
      setLista([])
    })

    
  },[socket])


  /*Vote Handlers*/

  const reset = () => {
    socket.emit('reset')
    setInput('')
    setLista([])
  }

  const pausa = () => {
    socket.emit('pause', btnState)

  }

  const selectItem = (clientProduct:any) => {
    socket.emit('loadProduct', clientProduct)
    enqueueSnackbar(` Product added for vote`, { variant: "success"})
  }

  const vote = (index: number) => {
    if(!voteValidator) {
      socket.emit('vote', index)
    }
  }

  useEffect(() => {
    console.log(lista.slice(0,btnPage));
  },[lista])

  const productsPerPage = 4
  const pagesVisited = btnPage * productsPerPage 

  // const handlePage = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

  //   const name = e.target.name

  //   if(name === 'izq' && btnPage > 1 ) setBtnPage(btnPage - 1 ) 
  //   if(name === 'der' ) setBtnPage(btnPage + 1 ) 
  //   console.log(lista, btnPage);
  // }




  useEffect(() => {
    setPercentage({perA: votacion?.voteA! / (votacion?.voteA! + votacion?.voteB! ) * 100 , perB: votacion?.voteB! / (votacion?.voteA! + votacion?.voteB!) * 100 })

  },[votacion])


  return (
    <main className={styles.container}>
      <header className={`${styles.header} flex flex-col items-center pt-20 pb-4`}>
        <h1>
          <img alt="RealTrends" src={logo} width={180} />
        </h1>
        <h3>Lets get this party started</h3>
      </header>


      <form className={`${styles.form} `} onSubmit={handleSearch}>
            <input placeholder='Search a product and select it to start ' onChange={handleInput} value={input} />
        </form>
        {/* <div className='flex justify-center gap-4 text-xl py-4'>
          <button name="izq" onClick={(e) => handlePage(e)}>{`<`}</button>
          <button name="der" onClick={(e) => handlePage(e)}>{`>`}</button>
        </div> */}
        {
          lista && <div className="flex flex-col items-center gap-2 pt-4  ">
            {
              lista.slice(0,5).map((product:any) => (
              <div key={product.id} >
                <Products img={product.thumbnail} product={product} selectItem={selectItem} title={product.title} price={product.price}/>
              </div>))
            }
          </div>
        }

      <div className={`${styles.containerApp}  pt-5 `}>
        <div className={`text-[#71d8bf] flex gap-5 z-50`}>
          <button onClick={reset}  ><IoReloadOutline size={30}/></button>
          <button onClick={pausa} ><IoPauseOutline size={32}/></button>
        </div>

        <div className={`${ btnState ? styles.stop : ''  }`}>{ btnState && <h1>VOTACIÓN EN PAUSA</h1>}</div>
      <div className={styles.wrapper}>
        <div className={styles.full}>
          <div className={styles.percentage} style={{ height: `${percentage!.perA}%`, backgroundColor: `hsl(${percentage!.perA}, 100%, 50%)`}} ></div>
            <div className={styles.card}>
            
                <h1>{cardProduct!.productA?.title ? cardProduct!.productA?.title : 'Product A title'}</h1>
                <h3>{cardProduct!.productA?.description ? cardProduct!.productA?.description : 'Product A description'}</h3>
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
          <div className={styles.percentage} style={{ height: `${percentage!.perB}%`, backgroundColor: `hsl(${percentage!.perB}, 100%, 50%)`}} ></div>
            <div className={styles.card}>

              <h1>{cardProduct!.productB?.title ? cardProduct!.productB?.title : 'Product B title'}</h1>
              <h3>{cardProduct!.productB?.description ? cardProduct!.productB?.description : 'Product B description'}</h3>
              <div className={styles.imageContainer} onClick={() => vote(1)}>
              <img src={`${cardProduct ? cardProduct.productB?.image : ''  }`}/>
              </div>
              <p>{votacion?.voteB! > 0 ? votacion?.voteB : '0'}  voto(s)</p>
              <div className={styles.msgBox}></div>
            </div>
            </div>
          </div>
      </div>




    </main>
  );
};

export default Home;
