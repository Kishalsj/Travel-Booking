import React, { useState } from 'react';
import HashLoader from "react-spinners/HashLoader";

function Loader() {
  const [color, setColor] = useState("#000000"); 
  const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div >
    <div className='sweet-loading text-center' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <HashLoader color={color} loading={true} css={override} size={100} />
    </div>
    </div>
  );
}

export default Loader;
