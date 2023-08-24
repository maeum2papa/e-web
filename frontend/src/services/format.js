const won = (number)=>{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const timeToDate = (time)=>{
    time = time.toString().replace("T"," ");
    time = time.toString().replace(".000Z"," ");
    return time;
}

export{
    won,
    timeToDate
}