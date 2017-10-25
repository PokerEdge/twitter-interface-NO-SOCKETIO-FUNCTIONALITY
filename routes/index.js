const express = require('express');
const Twit = require('twit');
const config = require('../config');
const router = express.Router();
const moment = require('moment');

const T = Twit(config);
let friendIds = [];
let dateData = [];
let tweetsText = [];
let favCount = [];
let RTCount = [];
let timeOfTweet = [];
// let connections =[];

//User's Twitter handle for use as parameter in GET requests
const screenName = {screen_name: 'shootaaa'};
const id = {user_id: '1602771427'};

//Populate object from segmented get requests using Twit package
var templateData = { title: 'Twitter Interface', username: '@Shootaaa' };

//Get list of 5 user id's that follow screenName (for use in other functions)
T.get('friends/ids', screenName, (err, data) => {

  friendIds = [];

  for(let i = 0; i < 5; i++){

    friendIds.push(`{user_id: ${data.ids[i]}}`);

  }

  templateData.friendIds = friendIds;

});

// Get your 5 most recent tweets
T.get('statuses/user_timeline', screenName, (err, data) => {

  if(err){
    console.log(err);
  }

  for(let k = 0; k < 5; k++){

    RTCount.push(data[k].retweet_count);
    favCount.push(data[k].favorite_count)
    tweetsText.push(data[k].text);
    timeOfTweet.push(moment(data[k].created_at).fromNow());

  }

  templateData.RTCount = RTCount;
  templateData.favCount = favCount;
  templateData.tweetsText = tweetsText;
  templateData.timeOfTweet = timeOfTweet;

});

// Get your 5 most recent friends (followers)
  //This method is especially powerful when used in conjunction with GET users / lookup, a method that allows you to convert user IDs into full user objects in bulk.
T.get('followers/ids', screenName, (err,data) => {

  //Friends count
  templateData.followers = data.ids.length;

});


//CALL TWEETS FUNCTION HERE TO MAKE USE OF ID -- ISSUE HERE
T.get('friends/list', screenName, (err,data) => {

    //real name 1
    templateData.followerOneName = data.users[0].name;

    //screen name 1
    templateData.followerOneScreenName = data.users[0].screen_name;

    //profile image 1
    templateData.followerOneProfileURL = data.users[0].profile_image_url.replace('normal', 'bigger');

    //real name 2
    templateData.followerTwoName = data.users[1].name;

    //screen name 2
    templateData.followerTwoScreenName = data.users[1].screen_name;

    //profile image 2
    templateData.followerTwoProfileURL = data.users[1].profile_image_url.replace('normal', 'bigger');


    //real name 3
    templateData.followerThreeName = data.users[2].name;

    //screen name 3
    templateData.followerThreeScreenName = data.users[2].screen_name;

    //profile image 3
    templateData.followerThreeProfileURL = data.users[2].profile_image_url.replace('normal', 'bigger');


    //real name 4
    templateData.followerFourName = data.users[3].name;

    //screen name 4
    templateData.followerFourScreenName = data.users[3].screen_name;

    //profile image 4
    templateData.followerFourProfileURL = data.users[3].profile_image_url.replace('normal', 'bigger');


    //real name 5
    templateData.followerFiveName = data.users[4].name;

    //screen name 5
    templateData.followerFiveScreenName = data.users[4].screen_name;

    //profile image 5
    templateData.followerFiveProfileURL = data.users[4].profile_image_url.replace('normal', 'bigger');
});


// Get your 5 most recent private messages


T.get('users/lookup', screenName, (err, data) => {

  // -# of retweets:     "retweet_count": 23936,
  console.log(data[0].status.retweet_count);
  templateData.retweetCount = data[0].status.retweet_count;

  // -# of favorites (aka 'likes'):    "favorite_count": 21879,
  console.log(data[0].status.favorite_count);
  templateData.favoriteCount = data[0].status.favorite_count;

  // -date Tweeted
  console.log(data[0].status.created_at);
  templateData.createdAt = data[0].status.created_at;

  // MANIPULATE DATES TO GIVE TIME OF TWEETS



  //-profile image
  console.log(data[0].profile_image_url.replace('normal','bigger'));
  templateData.profileImageURL = data[0].profile_image_url.replace('normal','bigger');

  //IS THIS VALID OR NECESSARY? - IT LOGS OUT AS UNDEFINED
  console.log(data[0].profile_background_banner_url + "*********");
  templateData.profileBackgroundImageURL = data[0].profile_banner_url;

  //-real name
  console.log(data[0].name);
  templateData.name = data[0].name;

  //-screenname
  console.log(data[0].screen_name);
  templateData.screenName = data[0].screen_name;

  //unnecessary?
  console.log(data[0].id_str);
  templateData.idString = data[0].id_str;

  //FriendsCount
  console.log(data[0].friends_count);
  templateData.friendsCount = data[0].friends_count;

  //Handle 404 err if no look up criteria match
  //Data comes in as incomingMessage and should have property of statusCode
  if(err){
    console.log(err);
  }
});

//Get 5 most recent direct message bodies, date the message was sent, and time the message was sent
T.get('direct_messages/sent', {count: 5}, (err, data, res) => {

  dateData = [];
  messageTextData = [];

  for (let j = 0; j < 5; j++){

    let timeOfDM = moment(data[j].created_at).fromNow();
    let messagesText = data[j].text;

    dateData.push(timeOfDM);
    messageTextData.push(messagesText);

  }

  templateData.messagesText = messageTextData;
  templateData.timeOfDM = dateData;

});


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', templateData);
});

// //HOOK UP SOCKET.IO PROPERLY
// router.post('/', (req, res, next) => {
//   //Form response will go to req.body and that's why we need bodyParser to populate the property
//     //because req.body is undefined by default
//   //To put the form response into the req.body, we need middleware
//   console.log(req.body.tweetText);
//
//   const tweetToSend = { status : req.body.tweetText };
//
//   //Tweet 'req.body.tweetText'
//   T.post('statuses/update', tweetToSend, (err, data, res) => {
//
//
//   });
//
//   // T.get('statuses/user_timeline', screenName, (err, data) => {
//   //   //Reset tweetsText array to accept new tweets
//   //   // tweetsText = [];
//   //
//   //   if(err){
//   //     console.log(err);
//   //   }
//   //
//   //   // for(let k = 0; k < 5; k++){
//   //     // CONTINUE HERE
//   //     tweetsText.pop(data[4].text);
//   //     tweetsText.unshift(data[0].text);
//   //
//   //     console.log(`NEW TWEET: ${data[0].text}`);
//   //
//   //     console.log(tweetsText);
//   //
//   //   // }
//   //   templateData.tweetsText = tweetsText;
//   // });
//
//   //Perhaps 'send' or 'end' the data to home route, instead of rendering it once more
//   res.end();
// });

//ERROR HANDLING REDIRECTS
//res.redirect(301, 'http://example.com');

// http://expressjs.com/en/api.html#res.status

module.exports = router;
