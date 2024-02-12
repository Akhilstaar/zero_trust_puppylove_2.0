import React, { useState } from 'react';
import '../styles/claimedhearts.css'
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { heartsReceivedFromFemales, heartsReceivedFromMales } from "../utils/UserData"

const style = { "display": "flex", "gap": "10px", "alignItems": "center" }
function Hearts() {
  return (
    <div className='recieved-box'>
      <div style={{ fontWeight: 'bold' }}>Your Hearts</div>
      <div className="heart-container" style={style}>
        <div className='gender-heart'>Female :</div>
        {/* <div className='hearts'>
          {Array(heartsReceivedFromFemales).fill(heartsReceivedFromFemales).map((_, index) => (
            <FavoriteIcon key={`female-heart-${index}`} color="secondary" fontSize="small" />
          ))}
        </div> */}
      </div>
      <div className="heart-container" style={style}>
        <div className='gender-heart'>Male : </div>
        {/* <div className='hearts'>
        {Array(heartsReceivedFromMales).fill(heartsReceivedFromMales).map((_, index) => (
          <FavoriteIcon key={`male-heart-${index}`} color="secondary" fontSize="small" />
        ))}
        </div> */}
      </div>
    </div>
  );
}

export default Hearts;
