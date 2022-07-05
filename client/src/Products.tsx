import React, { useEffect } from 'react'

import styles from './Products.module.css'
import { IProduct } from '../interfaces/IProduct';

type Props = {
  img:string;
  title: string;
  price:number;

}


export const Products = ({img, title, price}:Props) => {

  let formattedPrice = new Intl.NumberFormat('es-AR', {style:'currency', currency: 'ARS'}).format(price)

  return (
    <div className={`bg-white flex gap-4  overflow-hidden `}>
      <div className='px-4'>
        <img src={img} alt={title} width="180px" height="180px" className='' />
      </div>
      <div className='flex flex-col pt-6 items-start text-start'>
        <h3 className='text-xl font-light text-ellipsis '>{title}</h3>
        <p className='font-regular text-2xl py-2'>{`${formattedPrice}`}</p>
        <p className='text-xs font-medium text-green-500'>Envío gratis</p>
      </div>

    </div>
  )
}
