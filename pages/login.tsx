import React, { useState } from 'react';
import styles from '../styles/login.module.css'; // Import your CSS module
import { MdEmail } from 'react-icons/md'
import { BiSolidLock } from 'react-icons/bi'
import Image from 'next/image';
import "../app/globals.css"
import Link from 'next/link';
import { motion } from "framer-motion"
import Dog from '@/components/Dog';
import ThemeButton from '@/components/Theme';
// import ""



const LoginPage: React.FC = () => {
  const [data, setData] = useState({ email: "", password: "" });


  const handleLog = () => {
    console.log(data);
    setData({ email: "", password: '' });
    console.log(data);

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform authentication here, e.g., sending a request to a server
    // with the email and password for verification.

    // Reset form fields after submission
    // setEmail('');
    // setPassword('');
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data);
    // handleLog();
  };

  return (
    <div className={styles['login-box']}>
      <ThemeButton />
      <div className={styles['login-box2']}>
        <Dog />
        <div className={styles['login-container']}>
          <h1 className={styles['login-title']}>Login</h1>
          <motion.div whileHover={{ scale: 1.05 }} className={styles['login-form-group']}>
            <MdEmail size={18} />

            <input
              className={styles['login-input']}
              type="email"
              name='email'
              value={data.email}
              onChange={handleSubmit}
              required
              placeholder='Email'
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className={styles['login-form-group']}>
            <BiSolidLock size={18} />
            <input
              className={styles['login-input']}
              type="password"
              name='password'
              value={data.password}
              onChange={handleSubmit}
              required
              placeholder='Password'
            />
          </motion.div>
          <div className={styles['login-bottom']}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles['login-submit-button']} >
              <Link href={"/register"}>
                Register
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles['login-submit-button']} onClick={handleLog} >
              Login
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
// import * as React from 'react';
// import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
// import GlobalStyles from '@mui/joy/GlobalStyles';
// import CssBaseline from '@mui/joy/CssBaseline';
// import Box from '@mui/joy/Box';
// import Button from '@mui/joy/Button';
// import Checkbox from '@mui/joy/Checkbox';
// import FormControl from '@mui/joy/FormControl';
// import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
// import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
// import Link from '@mui/joy/Link';
// import Input from '@mui/joy/Input';
// import Typography from '@mui/joy/Typography';
// import Stack from '@mui/joy/Stack';
// import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
// import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
// import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';

// interface FormElements extends HTMLFormControlsCollection {
//   email: HTMLInputElement;
//   password: HTMLInputElement;
//   persistent: HTMLInputElement;
// }
// interface SignInFormElement extends HTMLFormElement {
//   readonly elements: FormElements;
// }

// function ColorSchemeToggle({ onClick, ...props }: IconButtonProps) {
//   const { mode, setMode } = useColorScheme();
//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => {
//     setMounted(true);
//   }, []);
//   if (!mounted) {
//     return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
//   }
//   return (
//     <IconButton
//       id="toggle-mode"
//       size="sm"
//       variant="outlined"
//       color="neutral"
//       aria-label="toggle light/dark mode"
//       {...props}
//       onClick={(event) => {
//         if (mode === 'light') {
//           setMode('dark');
//         } else {
//           setMode('light');
//         }
//         onClick?.(event);
//       }}
//     >
//       {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
//     </IconButton>
//   );
// }

// export default function JoySignInSideTemplate() {
//   return (
//     <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
//       <CssBaseline />
//       <GlobalStyles
//         styles={{
//           ':root': {
//             '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
//             '--Cover-width': '50vw', // must be `vw` only
//             '--Form-maxWidth': '800px',
//             '--Transition-duration': '0.4s', // set to `none` to disable transition
//           },
//         }}
//       />
//       <Box
//         sx={(theme) => ({
//           width:
//             'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
//           transition: 'width var(--Transition-duration)',
//           transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
//           position: 'relative',
//           zIndex: 1,
//           display: 'flex',
//           justifyContent: 'flex-end',
//           backdropFilter: 'blur(12px)',
//           backgroundColor: 'rgba(255 255 255 / 0.2)',
//           [theme.getColorSchemeSelector('dark')]: {
//             backgroundColor: 'rgba(19 19 24 / 0.4)',
//           },
//         })}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             minHeight: '100dvh',
//             width:
//               'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
//             maxWidth: '100%',
//             px: 2,
//           }}
//         >
//           <Box
//             component="header"
//             sx={{
//               py: 3,
//               display: 'flex',
//               alignItems: 'left',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Box
//               sx={{
//                 gap: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               <IconButton variant="soft" color="primary" size="sm">
//                 <BadgeRoundedIcon />
//               </IconButton>
//               <Typography level="title-lg">Company logo</Typography>
//             </Box>
//             <ColorSchemeToggle />
//           </Box>
//           <Box
//             component="main"
//             sx={{
//               my: 'auto',
//               py: 2,
//               pb: 5,
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 2,
//               width: 400,
//               maxWidth: '100%',
//               mx: 'auto',
//               borderRadius: 'sm',
//               '& form': {
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 2,
//               },
//               [`& .${formLabelClasses.asterisk}`]: {
//                 visibility: 'hidden',
//               },
//             }}
//           >
//             <Stack gap={4} sx={{ mb: 2 }}>
//               <Stack gap={1}>
//                 <Typography level="h3">Login</Typography>

//               </Stack>
//             </Stack>

//             <Stack gap={4} sx={{ mt: 2 }}>
//               <form
//                 onSubmit={(event: React.FormEvent<SignInFormElement>) => {
//                   event.preventDefault();
//                   const formElements = event.currentTarget.elements;
//                   const data = {
//                     email: formElements.email.value,
//                     password: formElements.password.value,
//                     persistent: formElements.persistent.checked,
//                   };
//                   alert(JSON.stringify(data, null, 2));
//                 }}
//               >
//                 <FormControl required>
//                   <FormLabel>Email</FormLabel>
//                   <Input type="email" name="email" />
//                 </FormControl>
//                 <FormControl required>
//                   <FormLabel>Password</FormLabel>
//                   <Input type="password" name="password" />
//                 </FormControl>
//                 <Stack gap={4} sx={{ mt: 2 }}>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                   >
//                     <Checkbox size="sm" label="Remember me" name="persistent" />
//                     <Link level="title-sm" href="#replace-with-a-link">
//                       Forgot your password?
//                     </Link>
//                   </Box>
//                   <Button type="submit" fullWidth>
//                     Sign in
//                   </Button>
//                 </Stack>
//               </form>
//             </Stack>
//           </Box>
//           <Box component="footer" sx={{ py: 3 }}>
//             <Typography level="body-xs" textAlign="center">
//               © Your company {new Date().getFullYear()}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       <Box

//       />
//     </CssVarsProvider>
//   );
// }

