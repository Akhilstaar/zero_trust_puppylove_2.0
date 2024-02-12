"use client"

import React, { useEffect, useState } from 'react';
import "../styles/result-page.css";
import Clear from "@/components/clear";
import Hearts from "@/components/Hearts";
import { Choices, choices, Id, setUser, Submit, user } from "@/utils/UserData";
import Results from "@/components/matchedResults";
import { useRouter } from "next/router"
import { search_students, Student } from '@/utils/API_Calls/search';
import { get_result } from '@/utils/API_Calls/result';
import { Button, useToast } from '@chakra-ui/react';
import { handle_Logout } from '@/utils/API_Calls/login_api';
import { FaSignOutAlt } from 'react-icons/fa';

const ResultPage = () => {

    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<Student>({} as Student)
    const [Matches, setMatches] = useState<Student[]>([])

    useEffect(() => {
        toast.closeAll()
    }, [])

    useEffect(() => {

        if (Id === '') {
            router.push('/login');
        } else {
            setUser(search_students(Id)[0]);
        }
    }, [])

    useEffect(() => {
        const show_result = async () => {
            const match_bool_array = await get_result();
            console.log(match_bool_array)
            for (let j = 0; j < 4; j++) {
                if (match_bool_array[j] == true) {
                    const data: Array<Student> = search_students(choices[`r${j + 1}` as keyof Choices])

                    if (!data.length) {
                        return;
                    }
                    const student = data[0];

                    if (!Matches.includes(student)) {
                        setMatches((prev) => [...prev, student])
                    }
                } else {
                    continue;
                }
            }
        }
        show_result();
        // console.log(Matches)
    }, [])

    const Logout = async () => {

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
    if (Id === '') {
        return (<></>);
    }
    return (
        <div className='box'>
            <Clear />

            <div className='logout-button-div'>
                <Button as="a" className="chakra-button" onClick={Logout} leftIcon={<FaSignOutAlt />}>
                    Logout
                </Button>
            </div>

            <div className='heror'>
                <div className='section-Ar'>
                    <div className='section_1r'>
                        <div className="info">
                            <div className="image-container">
                                <div className="image-boxr">
                                    <div className="profile" style={{
                                        backgroundImage: `url("https://home.iitk.ac.in/~${user?.u}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${user?.i}_0.jpg"), url("/dummy.png")`,
                                        width: '130px', height: '130px', backgroundSize: 'cover', borderRadius: "50%"
                                    }}></div>
                                </div>
                                {user && <div className="detail">
                                    <div className="details-text-name">{user?.n}</div>
                                    {/* <div className="details-text" >{user?.d}</div> */}
                                    <div className="details-text" >{user?.i}</div>
                                </div>}

                            </div>
                        </div>
                    </div>
                    {/* <div className='section_2r'><Hearts /></div> */}

                </div>
                <div className="section-Br">
                    {Matches.length > 0 ?

                        <div className='section_3r'>
                            <h2 style={{ fontSize: "25px", fontWeight: "bold" }}>Matches</h2>
                            <Results Matches={Matches} />
                        </div>
                        :

                        <div className='section_3r' style={{ display: "flex", justifyContent: "center" }}>
                            <h1>Sorry! No matches yet, please try again after some time.</h1>
                        </div>
                    }
                </div>
            </div>
            <Clear />
        </div>

    );
}

export default ResultPage;