const {leaderboard, reportCard} = require ('../controllers/premium');
const {findId} = require ('../middleware/authenticate');

const router = require ('express').Router ();
//for premium user only
router.get ('/premium/leader-board', findId, leaderboard);
router.get ('/premium/report-card', findId, reportCard);
module.exports = router;
