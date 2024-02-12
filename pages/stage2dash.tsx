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
import { Id, Submit } from "../utils/UserData"
import { search_students, Student } from '@/utils/API_Calls/search';
import Image from 'next/image';

const SERVER_IP = process.env.SERVER_IP

const Satge2dash = () => {
    const router = useRouter();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [hearts_submitted, set_hearts_submitted] = useState(Submit);
    const [clickedStudents, setClickedStudents] = useState<Student[]>([]);
    const [isShowStud, setShowStud] = useState(false);


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
                continue
            }
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

    const handleButtonClick = async (studentRoll: string) => {
        if (clickedStudents.length >= 4) {
            toast({
                title: 'You cannot select more than 4 students',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        const student = students.find((s) => s.i === studentRoll);

        if (student && !clickedStudents.find((s) => s.i === studentRoll)) {
            setClickedStudents([...clickedStudents, student])
        } else {
            toast({
                title: 'This student has already been clicked!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    };

    // TODO: Edit this function to only return a boolean array to stage2 submit...
    const handleUnselectStudent = async (studentRoll: string) => {
        const updatedStudents = clickedStudents.filter((s) => s.i !== studentRoll);
        setClickedStudents(updatedStudents)
    };

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

    const SendHeart_api = async (Submit: boolean) => {
        if (hearts_submitted) {
            return;
        }
        if (Submit) {
            set_hearts_submitted(true);
        }

        const isValid = await Send_K(Id, receiverIds, Submit)
        if (isValid && Submit) {
            toast({
                title: 'HEARTS SENT',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
        else if (!isValid && Submit) {
            toast({
                title: 'Error occurred , Hearts not sent',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
        else if (!isValid && !Submit) {
            toast({
                title: 'Choices not saved',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
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
                setActiveUsers(active.users)
            }
            catch (err) {
                // Cannot fetch Active users
                console.log(err)
            }
        }

        fetchActiveUsers()
    }, []);

    const isActive = (id: string) => {
        return activeUsers.includes(id);
    };

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

                        </div>
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

                    </div>
                </div>
                <div className="section-B">

                    <GoToTop />
                </div>
            </div>
            <Clear />
        </div>
    )
}

export default Satge2dash