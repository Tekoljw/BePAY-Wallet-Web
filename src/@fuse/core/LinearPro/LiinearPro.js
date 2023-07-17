import { useState, useEffect } from 'react';
import './linearpro.css';

const LiinearPro = (props) => {
  const [wid, setWid] = useState('250px');
  const [bgc, setBgc] = useState('blue');

  return (
    <div>
      <div className='borders' style={{ backgroundColor: props.mbck, width: wid, margin: "-10px 0px 0px 20px" }} />
    </div>
  );
}

export default LiinearPro;
