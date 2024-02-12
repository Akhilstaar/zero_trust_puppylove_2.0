"use client"
import React, { useEffect, useState } from 'react'
import { Button, useToast, Box } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "../styles/login.module.css";
import "../styles/dashboard.css"
import { BsSearch } from "react-icons/bs";
import Card from "@/components/card";
import Hearts from "@/components/Hearts";
import ClickedStudent from "@/components/clickedstudent";
import "../app/globals.css";
import GoToTop from '@/components/GoToTop';
import { useRouter } from 'next/router';
import Clear from '@/components/clear'; import { Send_K } from '@/utils/API_Calls/Send_Heart';
import { receiverIds, setUser, user } from '../utils/UserData';
import { handle_Logout } from '@/utils/API_Calls/login_api';
import { Id, S1submit, S2submit } from "../utils/UserData"
import { search_students, Student } from '@/utils/API_Calls/search';
import Image from 'next/image';
import Stage2list from '@/components/stage2list';

const SERVER_IP = process.env.SERVER_IP

const Stage2dash = () => {
    const router = useRouter();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [hearts_submitted, set_hearts_submitted] = useState(S2submit);
    const [clickedStudents, setClickedStudents] = useState<Student[]>([]);
    const [isShowStud, setShowStud] = useState(false);
    const [stage2Bool, set_stage2Bool] = useState<boolean[]>([]);
    // const stage2Bool = [];

    useEffect(() => {
        toast.closeAll()
    }, [])

    useEffect(() => {
        if (Id === '') {
            router.push('/login');
        } else {
            setUser(search_students(Id)[0]);
        }
    }, []);

    useEffect(() => {
        const handle_Tab_Close = async (e: any) => {
            await handle_Logout();
            return;
        };

        if (!hearts_submitted) {
            window.addEventListener('beforeunload', handle_Tab_Close);
        }

        return () => {
            window.removeEventListener('beforeunload', handle_Tab_Close);
        };
    }, []);

    const fetchAndSelectStudents = () => {
        const selected: Student[] = []
        for (let i = 0; i < 4; i++) {
            const id = receiverIds[i]
            if (id === '') {
                set_stage2Bool([...stage2Bool, false])
                continue
            }
            set_stage2Bool([...stage2Bool, true])
            const data = search_students(id);
            if (data == undefined) {
                return;
            }
            const student = data[0];
            if (student) {
                selected.push(student);
            }
        }
        setClickedStudents([...clickedStudents, ...selected])
    }

    useEffect(() => {
        fetchAndSelectStudents()
    }, [])

    // TODO: Edit this function to only return a boolean array to stage2 submit...


    const Handle_SendHeart = async () => {
        await SendHeart_api(true)
    }

    const handleYes = async () => {
        console.log("YES")
        await Handle_SendHeart();
        toast.closeAll();
    };

    const handleToast = () => {
        toast({
            position: "top",
            duration: null,
            isClosable: true,
            render: ({ onClose }) => (
                <Box bg="gray.100" borderRadius="md" p={4} textAlign="center">
                    <p style={{ fontWeight: "bold", color: "black" }}>Are you sure you want to Submit stage 2?, Once submitted You can't change your choices.</p>
                    <Button colorScheme="black" color="gray.800" bg="gray.300" onClick={onClose}>No</Button>
                    <Button colorScheme="pink" ml={2} onClick={() => {
                        handleYes();
                    }}>Yes</Button>
                </Box>
            )
        });
    };

    const onBoolChange = async (index: number, value: boolean) => {
        const updatedStage2Bool = [...stage2Bool];
        updatedStage2Bool[index] = value;
        set_stage2Bool(updatedStage2Bool);
    };

    const SendHeart_api = async (Submit: boolean) => {
        if (hearts_submitted) {
            return;
        }
        if (S2submit) {
            set_hearts_submitted(true);
        }
        const isValid = await Send_K(Id, stage2Bool, S2submit)
        if (isValid && S2submit) {
            toast({
                title: 'HEARTS SENT',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
        else if (!isValid && S2submit) {
            toast({
                title: 'Error occurred , Hearts not sent',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
        else if (!isValid && !S2submit) {
            toast({
                title: 'Choices not saved',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            set_hearts_submitted(false);
        }
    }

    const Logout = async () => {

        // console.log(clickedStudents)

        await SendHeart_api(false);
        const isValid = await handle_Logout()
        router.push('/')
        if (!isValid) {
            toast({
                title: 'Some error occured while Logging Out',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
        else {
            toast({
                title: 'Logged Out',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
    }

    useEffect(() => {
        const updateVirtualHeart = async () => {
            // console.log(clickedStudents)
            if (clickedStudents.length) {
                await SendHeart_api(false);
            }
        }

        if (clickedStudents.length > 0) updateVirtualHeart()
    }, [clickedStudents])

    const isActive = (id: string) => {
        return activeUsers.includes(id);
    };

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const res = await fetch(
                    `${SERVER_IP}/users/activeusers/stage2`, {
                    method: "GET",
                    credentials: "include",// For CORS
                }
                )
                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
                }
                const active = await res.json()
                console.log(active)
                setActiveUsers(active.users);
                // console.log(activeUsers)
            }
            catch (err) {
                // Cannot fetch Active users
                console.log(err)
            }
        }

        fetchActiveUsers()
    }, []);

    console.log(activeUsers)

    useEffect(() => {
        fetchStudents();
    }, [searchQuery]);

    const fetchStudents = () => {
        if (searchQuery === "") {
            setStudents([])
            return
        }
        const studentData = search_students(searchQuery);
        if (studentData == undefined) {
            // console.log("Not able to Fetch Students");
            return;
        }
        setStudents(studentData);
    };

    const handleShowStud = () => {
        setShowStud(!isShowStud);
    }

    const stylesss = {
        backgroundImage: `url("https://home.iitk.ac.in/~${user?.u}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${user?.i}_0.jpg"), url("/dummy.png")`,
    };

    if (Id == '') return;

    // TODO: Edit this whole page to only return a boolean array to stage2 submit...
    return (
        <div className='box'>
            <Clear />
            {/* LOGOUT BUTTON */}
            <div className='logout-button-div'>
                <Button as="a" className="chakra-button" onClick={Logout} leftIcon={<FaSignOutAlt />}>
                    Logout
                </Button>
            </div>
            <div className='hero'>
                <div className='section-A'>
                    <div className='section_1'>
                        <div className="info">
                            <div className="image-container">
                                <div className="image-box">
                                    <div className="profile" style={stylesss}></div>
                                </div>
                                {user && <div className="detail">
                                    <div className="details-text-name">{user?.n}</div>
                                    {/* <div className="details-text" >{user?.d}</div> */}
                                    <div className="details-text" >{user?.i}</div>
                                    {!hearts_submitted ? (
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={styles["heart-submit-button"]}
                                            onClick={handleToast}
                                            style={{ color: "white", margin: "12px 0px" }}
                                        >
                                            Submit
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className={styles["heart-submit-button"]}
                                            style={{ color: "white", backgroundColor: 'grey' }}
                                        >
                                            Submitted
                                        </motion.div>
                                    )}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-B">
                    <div className='section_3'>
                        <h1>STAGE - 2</h1>
                    </div>
                    <div className='section_2'>
                        <div className='logout-button-div'>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className='hide-show-btn'
                                style={{ marginBottom: "8px", position: "sticky", top: "0px", cursor: "pointer" }}
                                onClick={handleShowStud}
                            >
                                {isShowStud ? "Hide" : "Show"}
                            </motion.div>
                        </div>
                        <div>
                            {
                                isShowStud ? (clickedStudents.length > 0 ?
                                    <div>
                                        <Stage2list clickedStudents={clickedStudents} stage2Bool={stage2Bool} onBoolChange={onBoolChange} isActive={isActive} />
                                    </div>
                                    :
                                    <h2>Use search to select someone</h2>
                                ) : ""
                            }
                        </div>
                    </div>
                    <div>
                        {students.length == 0 &&
                            <div>
                                {/* <p>Welcome to Puppy Love</p> */}
                                <Image
                                    src={"/dashboard.jpeg"}
                                    alt="Logo"
                                    width={500}
                                    height={30}
                                />
                            </div>}
                        {

                        }
                    </div>
                    <GoToTop />
                </div>
            </div>
            <Clear />
        </div>
    )
}

export default Stage2dash