module.exports = response => {
    if ('succeed' in response)
        return response.succeed
    return true
}