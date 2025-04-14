const pageController = require('../controllers/pageController.js')

const router = (req,res) => {
    if(req.url == '/'){
        pageController.home(req,res)
    }
    else if(req.url == '/dashboard'){
        pageController.dashboard(req,res)
    }
    else{
        pageController.notFound(req,res)
    }
}

module.exports = router