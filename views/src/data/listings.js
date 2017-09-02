module.exports = {
    view:"job",
    jobs:["job:1234e3","job:1234e4"],
    candidates:["candidate:1234e4","candidate:D3C43F1"],
    clients:[],
    workgroups:[],
    reminders:[
        {
            id:"reminder:12344",
            content:"Remember to call candidate -12332443",
            date:"",
            isCompleted:false
        },
        {
            id:"reminder:12343",
            content:"Remember to call client -2345677",
            date:"8-8-2017",
            isCompleted:true
        },
        {
            id:"reminder:12342",
            content:"Remember to call another candidate -12332443",
            date:"8-8-2017",
            isCompleted:false
        },
        {
            id:"reminder:12341",
            content:"Remember to call the 'candidate' -33",
            date:"Sat Apr 22 2017 07:39:14 GMT+0100 (BST)",
            isCompleted:false
        },
        {
            id:"reminder:123440",
            content:"Remember to pay bill!",
            date:"Sat Apr 22 2017 07:39:14 GMT+0100 (BST)",
            isCompleted:false
        }
    ],
    items:{
        "candidate:D3C43F1":{
            firstname:"Gary",
            lastname:"CHAN",
            othername:"John",
            city:"Kowloon",
            country:"Hong Kong",
            requirevisa:false,
            seniority:3,
            availability:4,
            score:3,
            email:"gary@gmail.com",
            phone:"23131231",
            tag:["javascript","frontend","jquery"],
            expectedannualsalary:{
                currency:"HKD",
                expectedannualsalary:"400000"
            },
            expectedindustry:["banking","startup"],
            note:'<p>Hi this is my note</p>',
            summary:"gary is a good candidate who has 5 years experience",
            workexperience:[
                {
                    fieldid:"field232",
                    position:"Senior Developer",
                    organization:"BNX",
                    period:{
                        startdate:"2015-01-01",
                    },
                    description:'This is description',
                    industry:["IT"],
                    salary:{
                        currency:"HKD",
                        salary:"300000"
                    },
                    bonus:{
                        currency:"HKD",
                        bonus:"300000"
                    },
                    reasonofleaving:'Want more resposiblity',
                    note:'',
                    tag:["development","it"],
                },
                {
                    fieldid:"field231",
                    position:"Developer",
                    organization:"BNX",
                    period:{
                        startdate:"2012-01-01",
                        enddate:"2015-01-01",
                    },
                    description:'description,description',
                    industry:["IT"],
                    salary:{
                        currency:"HKD",
                        salary:"200000"
                    },
                    reasonofleaving:'Want more salary',
                    note:'yeahhhhh',
                    tag:["development","javascript"],
                },
            ],
            education:[
                {
                    fieldid:"field230",
                    position:"Master of Engineering",
                    organization:"University of New South Wales",
                    period:{
                        startdate:"2012-01-01",
                        enddate:"2010-01-01",
                    }
                }
            ]
        },
        "job:1234e3":{
            position:"Senior Developer",
            company:"ANX",
            currency:"HKD",
            salary:300000,
            tag:["IT","Frontend","Backend"],
            website:"http://google.com",
            contact:[
                {
                    firstname:"Amy",
                    position:"HR Manager",
                    phone:"2132131",
                    email:"amy@anx.hk"
                },
                {
                    firstname:"Peter",
                    lastname:"WONG",
                    position:"HR Director",
                    phone:"2132130",
                    email:"peter@anx.hk"
                }
            ],
            potential:2,
            submitted:1,
            interviewed:1,
            offered:1,
            shared:0,
            updated:2,
            listings:{
                potential:["candidate:D3C43F1","candidate:D3C43F0"],
                submitted:["candidate:D3C43F8"]
            }
        },
        "job:1234e4":{
            position:"Senior Marketing Manager",
            company:"BNX",
            currency:"HKD",
            salary:400000,
            tag:["IT","marketing","frontend","email"],
            website:"http://bnx.com",
            facebook:"http://facebook.com",
            linkedin:"http://linkedin.com",
            contact:[
                {
                    firstname:"Tony",
                    lastname:"WONG",
                    position:"HR Manager",
                    phone:"2132131",
                    email:"amy@bnx.hk"
                },
                {
                    firstname:"Cherry",
                    lastname:"CHAN",
                    position:"HR Director",
                    phone:"2132130",
                    email:"peter@bnx.hk"
                }
            ],
            potential:5,
            submitted:1,
            interviewed:0,
            offered:0,
            shared:2,
            updated:2,
            listings:{
                potential:["candidate:D3C43F1","candidate:D3C43F0"],
                submitted:["candidate:D3C43F8"]
            }
        },
        "candidate:1234e4":{
            firstname:"Peter",
            lastname:"WONG",
            position:"Developer",
            company:"ANX",
            currency:"HKD",
            salary:200000,
            tag:["IT","javascript","frontend","backend"],
            website:"http://bnx.com",
            linkedin:"http://linkedin.com/",
            contact:[
                {
                    phone:"2132131",
                    email:"peter@wong.hk"
                }
            ],
            potential:3,
            submitted:1,
            interviewed:0,
            offered:0,
            shared:2,
            updated:2,
            listings:{
            }
        },
        "candidate:D3C43F0":{
            firstname:"Tony",
            lastname:"WONG",
            othername:"",
            position:"Developer",
            company:"CNX",
            tag:["IT","Frontend","javascript","jquery"],
            updated:1
        },
        "candidate:D3C43F8":{
            firstname:"Jill",
            lastname:"WONG",
            othername:"",
            position:"Developer",
            company:"DNX",
            tag:["IT","Frontend","javascript","jquery"],
            updated:0
        }
    },
    tagOptions:{
        tag:["javascript","frontend","jquery","development","it"],
        currency:["HKG","USD"],
        industry:["startip","banking","IT"]
    }
}