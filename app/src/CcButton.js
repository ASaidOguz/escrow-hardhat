import React from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import PushNotify from './PushNotify';

export default function CcButton({text}) {
    const handleNotify=()=>{
        PushNotify('success','Copy','Copied to Board',2000)
    }
  return (
    <>
    <CopyToClipboard text={text}>
    <button type="button"  className="btn btn-link" style={{border:'none' ,color: 'rgb(0, 0, 255)'}} onClick={(e) => {
            e.preventDefault();

            handleNotify(text);
          }}><span className="bi bi-clipboard"></span></button>
    </CopyToClipboard>
    </>
  )
}
