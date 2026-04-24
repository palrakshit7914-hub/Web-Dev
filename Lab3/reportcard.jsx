import React from 'react';


const ReportCard = () => {

    console.log(data);
  return (
    <div>

    </div>
  )
}
{data.map((item) => {
    return (<div>
    <h1>Name: {item.name}</h1>
    <h2>Marks: {item.marks}</h2>
</div>
    )
})
}

export default ReportCard;