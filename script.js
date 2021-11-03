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
    const newLink = await prisma.link.create({
        data : {
            description : 'Fullstack tutorial for graphql',
            url : 'www.howtographql.com'
        }
    })
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
