const serverConsole = (string, dispFun) => dispFun('\x1b[36mserver@127.0.0.1>\x1b[0m ', string)
const server = { 
    log: string => serverConsole(string, console.log),
    error: string => serverConsole(string, console.error)
}

module.exports = server