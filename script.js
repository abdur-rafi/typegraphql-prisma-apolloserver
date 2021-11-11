// 1
const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken')

let t = jwt.sign({
    a : '6v'
}, 'a');

console.log(jwt.verify(t, 'a'));




// 2
const prisma = new PrismaClient();

// 3
async function main() {
    // const allLinks = await prisma.link.findMany();
    // console.log(allLinks);
    // console.log(await prisma.link.update({
    //     where : {
    //         id : 100
    //     },
    //     data : {
    //         description : 'asldkjflsdf'
    //     }
    // }))
    console.log(await prisma.link.deleteMany({
        where : {
            id : 21,
            postedById : 1
        } 
    }))
}



// 4
main()
    .catch((e) => {
        throw e;
    })
    // 5
    .finally(async () => {
        await prisma.$disconnect();
    });
