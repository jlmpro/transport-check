
class SampleController{
    getSample =  (req, res) => {
        res.send('get all samples here');
    }
}

module.exports = new SampleController();