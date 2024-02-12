import React from "react";
import Stage2Card from "./stage2card";
import "../styles/selectcard.css";
import { Student } from "../utils/API_Calls/search"

interface Stage2listProps {
    clickedStudents: Student[];
    stage2Bool: boolean[];
    onBoolChange: (index: number, value: boolean) => void;
    isActive: (id: string) => boolean;
}

const Stage2list: React.FC<Stage2listProps> = ({ clickedStudents, stage2Bool, onBoolChange,isActive }) => {
    return (
        <div className="clicked-students-container">
            {clickedStudents.map((student, index) => (
                <div key={student.i} className="student-container">
                    <Stage2Card
                        student={student}
                        onBoolChange={onBoolChange}
                        stage2Bool={stage2Bool}
                        index={index}
                        isActive={isActive}
                    />
                </div>
            ))}
        </div>
    );
};

export default Stage2list;
