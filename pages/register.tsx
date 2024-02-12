import React, { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import { MdEmail } from "react-icons/md";
import "../app/globals.css";
import Link from "next/link";
import { motion } from "framer-motion";
import Dog from "@/components/Dog";
import Clear from "@/components/clear";
import { handleRegister } from "../utils/API_Calls/register_api"
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";


const RegisterPage: React.FC = () => {

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    // It will be public anyway
    const CAPTCHA_KEY = process.env.CAPTCHA_KEY || "6LfxO2spAAAAADOgCFVJPvOKk_SFnw2wWvU0gx2G"

    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [id, setId] = useState("");

    const router = useRouter()
    const toast = useToast()

    const handleRegister_api = async () => {
        // Verify reCAPTCHA before proceeding
        if (!recaptchaToken) {
            console.log("reCAPTCHA not verified");
            alert("Please complete the reCAPTCHA verification");
            return;
        }

        const res_json: Response = await handleRegister(id, recaptchaToken)
        const status_code = res_json.status

        // // Only for testing 
        // router.push(`/verify?id=${id}`)
        // setId("");
        // // Only for testing 

        if (res_json.ok) {
            setId("");
            toast({
                title: 'Email sent Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            router.push(`/verify?id=${id}`)
        }
        switch (status_code) {
            case 403:
                toast({
                    title: 'Invalid Captcha OR Roll No entered',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                break;
            case 405:
                router.push('./login')
                toast({
                    title: 'You are already Registered. Login instead',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                break;
            case 401:
                toast({
                    title: 'Encountered error while sending email, please contact developers.',
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

    useEffect(() => {
        toast.closeAll()
    }, [])

    const handleSubmit = (e: any) => {
        const newId = e.target.value;
        setId(newId);
    };

    return (
        <div>
            <Clear />
            <div className={styles["login-box"]}>
                <div className={styles["login-box2"]}>
                    <Dog />
                    <div className={styles["login-container"]}>
                        <h1 className={styles["login-title"]}>Register</h1>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={styles["login-form-group"]}
                        >
                            <MdEmail size={18} />

                            <input
                                className={styles["login-input"]}
                                type="text"
                                name="Roll Number"
                                value={id}
                                onChange={handleSubmit}
                                required
                                placeholder="Roll Number"
                            />
                        </motion.div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "20px"
                            }}
                        >
                            <ReCAPTCHA sitekey={CAPTCHA_KEY} onChange={handleRecaptchaChange} />
                        </div>

                        <div className={styles["login-bottom"]}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}

                            >
                                <Link style={{ color: "black" }} href={"/login"} className={styles["login-submit-button"]}>Go to Login</Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={styles["login-submit-button"]}
                                style={{ color: 'black' }}
                                onClick={handleRegister_api}
                            >
                                Send OTP
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;