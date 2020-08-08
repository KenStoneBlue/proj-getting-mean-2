/* GET homepage */
const index = (req, res) => res.render('index', { title: 'Stone Blue Express '});

module.exports = {
  index
};
