import React, { useEffect } from 'react'

import styles from './Products.module.css'
import { IProduct } from '../interfaces/IProduct';

type Props = {
  img:string;
  title: string;
  price:number;
  selectItem:Function;
  product:IProduct[];
}


export const Products = ({img, title, price, selectItem, product}:Props) => {

  let formattedPrice = new Intl.NumberFormat('es-AR', {style:'currency', currency: 'ARS'}).format(price)

  return (
    <div className={`bg-white flex gap-4 overflow-hidden w-[60rem]`}>
      <div className='px-4 w-[180px] h-[180px] flex items-center' onClick={() => selectItem(product)}>
        <img src={img} alt={title}  className='cursor-pointer' />
      </div>
      <div className='flex flex-col pt-6 items-start  truncate  text-start'>
        <h3 className='text-xl font-light truncate text-ellipsis overflow-hidden'>{title}</h3>
        <p className='font-regular text-2xl py-2'>{`${formattedPrice}`}</p>
        <p className='text-xs font-medium text-green-500'>Envío gratis</p>
      </div>

    </div>
  )
}
