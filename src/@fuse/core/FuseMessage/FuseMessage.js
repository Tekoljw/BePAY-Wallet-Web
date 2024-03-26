// import { amber, blue, green } from '@mui/material/colors';
// import { styled } from '@mui/material/styles';
// import IconButton from '@mui/material/IconButton';
// import Snackbar from '@mui/material/Snackbar';
// import SnackbarContent from '@mui/material/SnackbarContent';
// import Typography from '@mui/material/Typography';
// import { memo, useState, useEffect } from 'react';
// import * as React from "react";
// import { useDispatch, useSelector } from 'react-redux';

// import {
//   hideMessage,
//   selectFuseMessageOptions,
//   selectFuseMessageState,
// } from 'app/store/fuse/messageSlice';
// import FuseSvgIcon from '../FuseSvgIcon';

// import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
// import Box from "@mui/material/Box";

// const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
//   '& .FuseMessage-content': {
//     ...(variant === 'success' && {
//       backgroundColor: green[600],
//       color: '#FFFFFF',
//     }),

//     ...(variant === 'error' && {
//       backgroundColor: theme.palette.error.dark,
//       color: theme.palette.getContrastText(theme.palette.error.dark),
//     }),

//     ...(variant === 'info' && {
//       backgroundColor: blue[600],
//       color: '#FFFFFF',
//     }),

//     ...(variant === 'warning' && {
//       backgroundColor: amber[600],
//       color: '#FFFFFF',
//     }),
//   },
// }));



// function LinearProgressWithLabel(props) {
//   return (
//     <Box className='' sx={{ display: 'flex', marginTop: "-8px", justifyContent: "center", alignItems: 'center' }}>
//       <Box sx={{ width: '96%' }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//     </Box>
//   );
// }


// const variantIcon = {
//   success: 'check_circle',
//   warning: 'warning',
//   error: 'error_outline',
//   info: 'info',
// };


// function FuseMessage(props) {
//   const dispatch = useDispatch();
//   const state = useSelector(selectFuseMessageState);
//   const options = useSelector(selectFuseMessageOptions);

//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress <= 100 && prevProgress > 0) {
//           return prevProgress - 3.33;
//         } else {
//           clearInterval(timer);
//           return 0;
//         }
//       });
//     }, 100);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return (
//     <>
//       <StyledSnackbar
//         {...options}
//         open={state}
//         onClose={() => dispatch(hideMessage())}
//         ContentProps={{
//           variant: 'body2',
//           headlineMapping: {
//             body1: 'div',
//             body2: 'div',
//           },
//         }}
//       >
//         <div>
//           <SnackbarContent
//             className="FuseMessage-content messageBgColor "
//             message={
//               <div className="flex items-center">
//                 {options.code === 1 && <img className='w-24 h-24' src="wallet/assets/images/menu/success.png"></img>}
//                 {options.code === 2 && <img className='w-24 h-24' src="wallet/assets/images/menu/error.png"></img>}
//                 {options.code === 3 && <img className='w-24 h-24' src="wallet/assets/images/menu/tanHao.png"></img>}
//                 {(options.code === undefined || options.code === null) && <img className='w-24 h-24' src="wallet/assets/images/menu/success.png"></img>}
//                 {variantIcon[options.variant] && (<FuseSvgIcon color="inherit">{variantIcon[options.variant]}</FuseSvgIcon>)}
//                 <Typography className="mx-8">{options.message}</Typography>
//                 {/* <Typography className="mx-8">Successfully logged in</Typography> */}
//               </div>
//             }
//             action={[
//               <IconButton
//                 key="close"
//                 aria-label="Close"
//                 color="inherit"
//                 onClick={() => dispatch(hideMessage())}
//                 size="large"
//                 style={{ zIndex: "999" }}
//               >
//                 <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
//               </IconButton>,
//             ]}
//           />
//           <LinearProgressWithLabel value={progress} />
//         </div>

//       </StyledSnackbar>

//     </>
//   );
// }

// export default memo(FuseMessage);
import { amber, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { memo, useState, useEffect, useRef } from 'react';
import * as React from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  hideMessage,
  selectFuseMessageOptions,
  selectFuseMessageState,
} from 'app/store/fuse/messageSlice';
import FuseSvgIcon from '../FuseSvgIcon';

import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import LiinearPro from '../LinearPro/LiinearPro';

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  '& .FuseMessage-content': {
    ...(variant === 'success' && {
      backgroundColor: green[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'error' && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    }),

    ...(variant === 'info' && {
      backgroundColor: blue[600],
      color: '#FFFFFF',
    }),

    ...(variant === 'warning' && {
      backgroundColor: amber[600],
      color: '#FFFFFF',
    }),
  },
}));


function LinearProgressWithLabel(props) {
  return (
    <Box className='' sx={{ display: 'flex', marginTop: "-5px", justifyContent: "center", alignItems: 'center' }}>
      <Box sx={{ width: '96%' }}>
        {/* <LinearProgress variant="determinate" {...props} /> */}
        <LiinearPro/>
      </Box>
    </Box>
  );
}


const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info',
};

function FuseMessage(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectFuseMessageState);
  const options = useSelector(selectFuseMessageOptions);
  const [progress, setProgress] = useState(100);

  // const ref = useRef(0);
  // useEffect(() => {
  //   if (state) {
  //     const timer = setInterval(() => {
  //       ref.current = ref.current - 4.33;
  //       if (ref.current <= 100 && ref.current > 0) {
  //         setProgress(ref.current);
  //       } else {
  //         setProgress(0);
  //         clearInterval(timer);
  //       }
  //       console.log(ref.current, 'progress...');
  //       // setProgress(() => {
  //       //   if (tmpProgress <= 100 && tmpProgress > 0) {
  //       //     tmpProgress = tmpProgress - 4.33;
  //       //     return tmpProgress;
  //       //   } else {
  //       //     clearInterval(timer);
  //       //     return 0;
  //       //   }
  //       // });
  //     }, 100);
     
  //     return () => {
  //       ref.current = 100;
  //       clearInterval(timer);
  //       // setProgress(100)
  //     };
  //   }
  //   // if(options.code==2){
  //   //   setProgress(100)
  //   // }
    
  // });
  const ref = useRef(0);
  // useEffect(() => {
  //     if (state) {
  //         ref.current = 100;
  //         const timer = setInterval(() => {
  //             ref.current -= 4.33;
  //             if (ref.current <= 100 && ref.current > 0) {
  //                 setProgress(ref.current);
  //             } else {
  //                 clearInterval(timer);
  //                 setProgress(0);
  //                 setTimeout(() => {
  //                     setProgress(100);
  //                 }, 100);
  //             }
  //             console.log(ref.current, 'Progress......')
  //         }, 100);
  //         return () => {
  //             clearInterval(timer);
  //         };
  //     }
  // }, [state]);
  return (
    <>
      <StyledSnackbar
        {...options}
        open={state}
        onClose={() => dispatch(hideMessage())}
        ContentProps={{
          variant: 'body2',
          headlineMapping: {
            body1: 'div',
            body2: 'div',
          },
        }}
      >
        <div>
          <SnackbarContent className="FuseMessage-content messageBgColor "
            message={
              <div className="flex items-center ">
                {/* {options.code === 1 && <img className='w-24 h-24' src="wallet/assets/images/index/success.png"></img>}
                {options.code === 2 && <img className='w-24 h-24' src="wallet/assets/images/index/error.png"></img>}
                {options.code === 3 && <img className='w-24 h-24' src="wallet/assets/images/index/tanHao.png"></img>} */}
                  {options.code === 1 && <img className='w-24 h-24' src="wallet/assets/images/menu/success.png"></img>}
                 {options.code === 2 && <img className='w-24 h-24' src="wallet/assets/images/menu/error.png"></img>}
                {options.code === 3 && <img className='w-24 h-24' src="wallet/assets/images/menu/tanHao.png"></img>}
                {(options.code === undefined || options.code === null) && <img className='w-24 h-24' src="wallet/assets/images/menu/tanHao.png"></img>}
                {variantIcon[options.variant] && (
                  <FuseSvgIcon color="inherit">{variantIcon[options.variant]}</FuseSvgIcon>
                )}
                <Typography className="mx-8">{options.message}</Typography>
                {/* <Typography className="mx-8">Successfully logged in</Typography> */}
              </div>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={() => dispatch(hideMessage())}
                size="large"
                style={{ zIndex: "999" }}
              >
                <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
              </IconButton>,
            ]}
          />
            {options.code==1?<LiinearPro  mbck="#14C2A3"/>:options.code==2?<LiinearPro  mbck="#EE124B"/>:<LiinearPro  mbck="#14C2A3"/>}
           {/* <LinearProgressWithLabel value={progress} /> */}
        </div>

      </StyledSnackbar>

    </>
  );
}

export default memo(FuseMessage);