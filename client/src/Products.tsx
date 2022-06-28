import React from 'react'

import styles from './Products.module.css'
import { IProduct } from '../interfaces/IProduct';




export const Products = ({img, title, price}:IProduct) => {
  return (
    <div className={styles.container}>
        <img src={img} alt={title} />
        <div>
          <h3>{title}</h3>
          <p>{price}</p>
        </div>
    </div>
  )
}
