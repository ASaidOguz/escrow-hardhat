import React, { useState,useEffect } from 'react'
import {Dna} from'react-loader-spinner'
import gif from './assets/comp_4.gif'
export default function Loader() {
    const[nodata,setNodata]=useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
         setNodata(true)
        }, 3000);
        return () => clearTimeout(timer);
      }, []);
  return (
    <div>
      {!nodata?<div className='fields'> <Dna
           visible={true}
           height="300"
           width="402"
           ariaLabel="dna-loading"
           wrapperStyle={{}}
           wrapperClass="dna-wrapper"
    /></div>:<div className='archived-contracts'><img src={gif} alt='gif'/><div>No Data to show</div></div>}
    </div>
  )
}
