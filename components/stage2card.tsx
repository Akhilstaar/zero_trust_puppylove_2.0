import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import "../styles/selectcard.css";

const Stage2Card = ({ student, onBoolChange, stage2Bool, index, isActive }: any) => {
    const userName = student.u;
    const roll = student.i;

    const stylesss = {
        backgroundImage: `url("https://home.iitk.ac.in/~${userName}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${roll}_0.jpg"), url("/dummy.png")`,
    };

    const [isClicked, setIsClicked] = useState(stage2Bool[index]);

    const clicked = () => {
        if (!isActive(student.id)) return;
        setIsClicked(!isClicked);
    };

    useEffect(() => {
        // Update stage2Bool array when isClicked changes
        onBoolChange(index, isClicked);
    }, [isClicked]);

    return (
        <div className={`select-card ${isActive(student.id) ? '' : 'inactive'}`} onClick={clicked}>
            <div className="select-image-box">
                <div className="select-profile" style={stylesss}></div>
            </div>
            <p className="select-card-details">{student.n}</p>
            <p className="select-card-details">{student.i}</p>
            {isActive(student.id) && (
                <Box as="span" className="sign" color={isClicked ? "red.500" : "green.500"} fontSize="2xl">
                    {isClicked ? '&#10006;' : '&#10004;'}
                </Box>
            )}
        </div>
    );
};

export default Stage2Card;
