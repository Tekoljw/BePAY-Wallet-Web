import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

function Error404Page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">
      <div className="w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
        >
          <img src="wallet/assets/images/wallet/404.png"></img>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <Typography
            variant="h1"
            className="mt-48 sm:mt-96 text-4xl md:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
          >
            Ooops... 404!
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            className="mt-8 text-lg md:text-xl font-medium tracking-tight text-center"
          >
            The page you requested could not be found.
          </Typography>
        </motion.div>

        <Link className="block font-normal mt-48" to="/">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Error404Page;
