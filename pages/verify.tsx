import React, { useState, useEffect } from 'react';
import styles from '../styles/login.module.css';
import { BiSolidLock } from 'react-icons/bi'
import { BsPersonVcardFill } from 'react-icons/bs'
import "../app/globals.css"
import { motion } from "framer-motion"
import Dog from '@/components/Dog';
import { useRouter } from 'next/router';
import { handleVerifyOTP } from "../utils/API_Calls/verify_api";
import Clear from '@/components/clear';
import Link from 'next/link';
import { useToast } from '@chakra-ui/react'
import { IoEye } from 'react-icons/io5';

const VerifyPage: React.FC = () => {
    const router = useRouter()

    const [pass, setPass] = useState("password")
    const [pass1, setPass1] = useState("password")
    const toast = useToast()
    const [input_OTP, setOTP] = useState("")

    // flags to enforce alpha-numeric passwords
    const [isAlphaPresent, setIsAlphaPresent] = useState(false)
    const [isNumPresent, setIsNumPresent] = useState(false)

    const [data, setData] = useState({
        confirmPassword: '',
        password: '',
    });

    const handleEye = () => {
        if (pass === "password") setPass("text")
        else setPass("password")
    }

    const handleEye1 = () => {
        if (pass1 === "password") setPass1("text")
        else setPass1("password")
    }

    const handleOTP = (e: any) => {
        e.preventDefault()
        setOTP(e.target.value)
    }

    const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    useEffect(() => {
        console.log(router)
        if (router.asPath === "/verify") {
            router.push("/")
        }
        toast.closeAll()
    }, [])

    useEffect(() => {
        const alphaRegex = /[a-zA-Z]/
        setIsAlphaPresent(alphaRegex.test(data.password))

        const numRegex = /\d/;
        setIsNumPresent(numRegex.test(data.password))
    }, [data.password]);

    const handleVerifyOTP_api = async () => {
        const id = router.query
        if (id === null) {
            return
        }
        if (data.password !== data.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            // RENTER PASSWORD
            return
        }
        // password not safe enough
        if (!(isAlphaPresent && isNumPresent && data.password.length >= 8)) {
            toast({
                title: 'Please set a alpha-numeric password of minimum 8 characters',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            return
        }

        const user = { id: id, pass: data.password, auth: input_OTP }
        const res_json: Response = await handleVerifyOTP(user)

        if (res_json.ok) {
            router.push("/login")
            toast({
                title: 'Verified',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }

        switch (res_json.status) {
            case 400:
                toast({
                    title: 'Please enter another public key !!, ie try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                break;
            case 403:
                toast({
                    title: 'Invalid OTP entered',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                break;
            default: {
                toast({
                    title: 'Server Error',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                break;
            }
        }
    };

    return (
        <div>
            <Clear />

            <div className={styles['login-box']}>

                <div className={styles['login-box2']}>

                    <Dog />

                    <div className={styles['login-container']}>
                        <h1 className={styles['login-title']}>Verify</h1>
                        {(
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} className={styles['login-form-group']}>
                                    <BiSolidLock size={18} />
                                    <input
                                        className={styles['login-input']}
                                        type={pass}
                                        name='password'
                                        value={data.password}
                                        onChange={handleSubmit}
                                        required
                                        placeholder='New Password'
                                    />
                                    <IoEye size={18} onClick={handleEye} />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className={styles['login-form-group']}>
                                    <BiSolidLock size={18} />
                                    <input
                                        className={styles['login-input']}
                                        type={pass1}
                                        name='confirmPassword'
                                        value={data.confirmPassword}
                                        onChange={handleSubmit}
                                        required
                                        placeholder='Confirm New Password'
                                    />
                                    <IoEye size={18} onClick={handleEye1} />
                                </motion.div>
                            </>
                        )}
                        {(<>
                            <motion.div whileHover={{ scale: 1.05 }} className={styles['login-form-group']}>
                                <BsPersonVcardFill size={18} />
                                <input
                                    className={styles['login-input']}
                                    type="string"
                                    name='rollNo'
                                    onChange={handleOTP}
                                    required
                                    placeholder='OTP token'
                                />
                            </motion.div>
                            <div className={styles["login-bottom"]}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}

                                >
                                    <Link style={{ color: "black" }} href={"/login"} className={styles["login-submit-button"]}>Go to Login</Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} onClick={handleVerifyOTP_api} whileTap={{ scale: 0.9 }} className={styles['login-submit-button']}>
                                    <button style={{ color: "black", width: "100%" }}>Verify OTP</button>
                                </motion.div>

                            </div>
                            {!(isAlphaPresent && isNumPresent && data.password.length >= 8) ? (
                                <div style={{ color: 'red' }}>
                                    * Password must be alpha-numeric <br />
                                    * Password must have a minimum length of 8
                                </div>
                            ) : null}
                        </>
                        )}
                    </div>

                </div>
            </div>
            <Clear />
        </div>
    );
};

export default VerifyPage;