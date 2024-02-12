import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import "../styles/selectcard.css";

const Stage2Card = ({ student, onBoolChange, stage2Bool, index, isActive }: any) => {
    console.log("isActive:", isActive(student.i));
    const userName = student.u;
    const roll = student.i;

    const stylesss = {
        backgroundImage: `url("https://home.iitk.ac.in/~${userName}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${roll}_0.jpg"), url("/dummy.png")`,
    };

    const [isClicked, setIsClicked] = useState(stage2Bool[index]);

    const clicked = () => {
        if (!isActive(student.i)) return;
        setIsClicked(!isClicked);
    };

    useEffect(() => {
        onBoolChange(index, !isClicked);
    }, [isClicked]);

    return (
        <div className={`select-card ${isActive(student.i) ? '' : 'inactive'}`} onClick={clicked}>
            <div className="select-image-box">
                <div className="select-profile" style={stylesss}></div>
            </div>
            <p className="select-card-details">{student.n}</p>
            <p className="select-card-details">{student.i}</p>
            {isActive(student.i) && (
                <Box as="span" className="sign" color={isClicked ?"green.500": "red.500" } fontSize="2xl">
                    {isClicked ? 'Send Heart ✅':'Dont Send Heart ❌' }
                </Box>
            )}
        </div>
    );
};

export default Stage2Card;
