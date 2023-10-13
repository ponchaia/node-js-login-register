module.exports = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.redirect('/home')
        }
         
        res.clearCookie('myapp')
        res.redirect('/')
    })
}