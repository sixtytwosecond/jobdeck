export const icon ={
    phone:"phone",
    email:"mail outline",
    potential:"find",
    submitted:"send",
    interviewed:"calendar",
    offered:"check",
    shared:"users",
    updated:"time",
    updatedat:"time",
    name:"user",
    website:"globe",
    title:"id badge",
    "activejobs":"suitcase",
    "inactivejobs":"checkmark",
    "activeGroup":"suitcase",
    member:"users",
    tag:"tag",
    facebook:"facebook",
    twitter:"twitter",
    instagram:"instagram",
    linkedin:"linkedin",
    sharedjob:"suitcase",
    sharedcandidate:"user"
}

export const dateFormat=function(date){
    var convertMonth=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var d=date
    if(typeof date!=="object"){
        d=new Date(date)
    }
    var day=d.getDate();
    day=day<10?("0"+day):day
    var month=convertMonth[d.getMonth()]
    return month+" "+day
}