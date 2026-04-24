import students from "./Data";
import { useState } from "react";
import "./App.css";
export default function Reportcard() {
  const [studentData, setStudentData] = useState(students);
  console.log(students);
  function submitHandler(event) {
    event.preventDefault();
    console.log(event.target.name.value);
    console.log(event.target.marks.value);
    let studentObj = {};
    studentObj.name = event.target.name.value;
    studentObj.marks = event.target.marks.value;
    setStudentData((PreData) => [...PreData, studentObj]);
    console.log(studentObj);
    students.push(studentObj);
  }

  return (
    <div id="ReportCard">
      Report Card
      <h1>Report Card</h1>
      {/*  */}
      <form onSubmit={submitHandler}>
        <input className="int1" placeholder="Name..." name="name"></input>
        <input className="int2" placeholder="Marks..." name="marks"></input>
        <button type="submit">Add</button>
      </form>
      {/* <p>Name:{data[0].name} </p>         
            <p>Marks: {data[0].marks}</p> */}
      {studentData.map((item, index) => {
        //map
        return (
          <div key={index} className="res">
            <p className="p1">Name: {item.name}</p>
            <p className="p2">Marks: {item.marks}</p>
          </div>
        );
      })}
    </div>
  );
}
