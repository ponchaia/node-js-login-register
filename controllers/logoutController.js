module.exports = (req, res) => {
    res.clearCookie('nodeToken')
    req.session.destroy((err) => {
        if(err){
            return res.redirect('/home')
        }
         
        res.clearCookie('nodeToken')
        res.redirect('/')
    })
}