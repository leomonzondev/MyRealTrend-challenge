import React from 'react'

import styles from './Products.module.css'

export const Products = ({img, title, price}) => {
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
