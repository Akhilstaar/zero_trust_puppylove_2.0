
import React from "react";
import Stage2Card from "./stage2card";
import "../styles/selectcard.css";
import { Student } from "../utils/API_Calls/search"

interface Stage2listProps {
    clickedStudents: Student[];
    onUnselectStudent: (studentRoll: string) => void;
    hearts_submitted: boolean
}

const Stage2list: React.FC<Stage2listProps> = ({ clickedStudents, onUnselectStudent, hearts_submitted }) => {
    return (
        <div className="clicked-students-container">
            {clickedStudents.map((student) => (
                <Stage2Card
                    key={student.i}
                    student={student}
                    onClick={() => onUnselectStudent(student.i)}
                    unselectButton={true}
                    hearts_submitted={hearts_submitted}
                />
            ))}
        </div>
    );
};

export default Stage2list;