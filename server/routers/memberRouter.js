const express = require("express");
const router = express.Router();
const Member = require("../models/memberModel")

// getting all
router.get('/', async (req, res) => {
    try{
        const members = await Member.find();
        res.json(members);
    }
    catch (error){
        res.status(500).json({ errMessage: error.message });
    }
});

// getting by identity
router.get('/identity/:identity', getMembers, async (req, res) => {
    res.json(res.members);
});

// getting by name
router.get('/name/:name', getMembers, async (req, res) => {
    res.json(res.members);
});

// getting by id
router.get('/id/:id', getMembers, async (req, res) => {
    res.json(res.members);
});

// getting one by id
router.get("/:id", getMember, (req, res) => {
    res.json(res.member);
});

// creating one
router.post("/", async(req, res) => {
    const member = new Member({
        id: req.body.id,
        name: req.body.name,
        identity: req.body.identity
    });
    try{
        const newMember = await member.save();
        res.status(201).json(newMember);
    }
    catch(error){
        if (error.code != 11000){
            res.status(500).json({ errMessage: 'An unexpected error occurred.' });
        }
        else{
            res.status(400).json({ errMessage: 'Id already exists.' });
        };
    };
});

// updating one
router.patch("/:id", getMember, async (req, res) => {
    if(req.body.id != null){
        res.member.id = req.body.id;
    };
    if(req.body.name != null){
        res.member.name = req.body.name;
    };
    try{
        const updateMember = await res.member.save();
        res.json(updateMember);
    }
    catch(error){
        res.status(400).json({ errMessage: error.message });
    }
});

// deleting one
router.delete("/:id", getMember, async (req, res) => {
    try{
        await res.member.deleteOne();
        res.json({ message: "Deleted Member" });
    }
    catch(error){
        res.status(500).json({ errMessage: error.message });
    };
});

async function getMember(req, res, next){
    let member;
    const queryParam = Object.keys(req.params)[0];

    try{
        member = await Member.findOne({[queryParam]: req.params[queryParam]});

        if(member == null){
            return res.status(404).send({ errMessage: "Cannot find member" });
            // return res.status(404).json({ errMessage: "Cannot find member" });
        };
    }
    catch(error){
        return res.status(500).json({ errMessage: error.message });
    };

    res.member = member;
    next()
};

async function getMembers(req, res, next){
    let members;
    const queryParam = Object.keys(req.params)[0];

    try{
        if(queryParam === "id"){
            members = await Member.find({ [queryParam] : req.params[queryParam] });
        }
        else if(queryParam === "name"){
            const searchKeywords = req.params[queryParam].split(' ');
            const conditions = searchKeywords.map(keyword => ({
                [queryParam]: { $regex: keyword, $options: 'i' }
            }));
            const query = {
                $or: conditions
            };

            members = await Member.find(query);

            members.sort((memberA, memberB) => {
                const matchesA = countMatches(memberA, conditions);
                const matchesB = countMatches(memberB, conditions);
                return matchesB - matchesA;
            });
              
            function countMatches(member, conditions) {
                return conditions.reduce((count, condition) => {
                    if (conditionMatches(member, condition)) {
                    return count + 1;
                    }
                    return count;
                }, 0);
            }
              
            function conditionMatches(member, condition) {
                return Object.keys(condition).every(key => {
                    return new RegExp(condition[key].$regex, condition[key].$options).test(member[key]);
                });
            };
        }
        else{
            members = await Member.find({ [queryParam] : { $regex: req.params[queryParam], $options: 'i' } });
        };

        if(members == null){
            return res.status(404).json({ message: "Cannot find members" });
        };
    }
    catch(error){
        return res.status(500).json({ errMessage: error.message });
    };

    res.members = members;
    next()
};

const Router = router;

module.exports = Router;