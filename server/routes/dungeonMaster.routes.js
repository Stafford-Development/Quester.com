import express from 'express';
import OpenAI from "openai";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { createCampaign, updateCampaign, confirmUser, readCampaign, createUser, getUser, viewUserCampaigns, deleteCampaign, emailConfirmation, retrieveEmail, checkConfirmed, readApiKey, uploadAPIKey, deleteAPIKey, deleteUser } from '../database/db.js'

dotenv.config();

const router = express.Router();
const saltingRounds = 10;

let messageContent = "";




router.post('/chat', async (req, res) => {
    const apiKey = await readApiKey(req.session.userId);
    const openai = new OpenAI({apiKey: apiKey});
    const campaign = await readCampaign(req.session.userId, req.body.campaignId);
    let conversationHistory = campaign.log;
    conversationHistory.push({role: "user", content: req.body.message});
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationHistory
    });
    messageContent = chatCompletion.choices[0].message.content;
    conversationHistory.push({role: "assistant", content: messageContent});
    const updatedCampaign = await updateCampaign(req.session.userId, req.body.campaignId, conversationHistory);
    res.send(updatedCampaign);
  });
  
 /* router.post('/image', async (req, res) => {
    //image completion
    const imageCompletion = await openai.images.generate({
      model: "dall-e-3",
      prompt: messageContent,
      quality:"standard",
      size: "1792x1024",
      n: 1
    });
    const imageURL = imageCompletion.data[0];
    res.send(imageURL)
  });*/

  router.post('/create-user', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltingRounds, async function(err, hash) {
      const user = await createUser(email, hash);
      await emailConfirmation(email);
      res.send(user);
    });
  });
  router.post('/send-email', async (req, res) => {
    try {
    const email = await retrieveEmail(req.session.userId);
    await emailConfirmation(email);
    res.send({success: true});
    }
    catch (error) {
      res.send({success: false});
    }
  });
  router.post('/login-user', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await getUser(email);
      const hash = user.password;
      bcrypt.compare(password, hash, function(err, result) {
        if (result) {
          req.session.userId = user._id;
          res.send({success: true});
        } else {
          res.send({success: false});
        }
      });
    } catch (error) {
      res.send({success: false});
    }
  });
  router.get('/logout', (req, res) => {
    try {
      req.session.destroy(err => {
        if(err) {
          res.send({loggedOut: false});
        }
        res.clearCookie('connect.sid');
        res.send({loggedOut: true});
    });
    } catch (error) {
      res.send({loggedOut: false});
    }
  });

  router.get('/check-login', (req, res) => {
    try {
      if (req.session.userId) {
        res.send({ loggedIn: true, userId: req.session.userId });
      } else {
        res.send({ loggedIn: false });
      }
    } catch (error) {
      res.send({ loggedIn: false });
    }
  });
  router.get('/view-campaigns', async (req, res) => {
    const campaigns = await viewUserCampaigns(req.session.userId);
    res.send(campaigns);
  });
  router.post('/create-campaign', async (req, res) => {
    const campaign = await createCampaign(req.session.userId, req.body.title, req.body.description);
    res.send(campaign);
  });
  
  router.post('/update-campaign', async (req, res) => {
    const campaign = await updateCampaign(req.session.userId, req.body.campaignId, req.body.log);
    res.send(campaign);
  });
  router.post('/read-campaign', async (req, res) => {
    const campaign = await readCampaign(req.session.userId, req.body.campaignId);
    res.send(campaign);
  });
  router.post('/delete-campaign', async (req, res) => {
    const campaign = await deleteCampaign(req.session.userId, req.body.campaignId);
    res.send(campaign);
  });
  router.get('/confirm-email/:token', async (req, res) => {
    try {
      const token = req.params.token;
    
      const user = await confirmUser(token);
    
      // Redirect the user to the login page, or send a success message
      res.redirect(`${process.env.BASE_URL}/ConfirmationSuccess`);
    } catch (error) {
      res.send({message: 'Error confirming email'});
    }
  });
  router.get('/check-confirmed', async (req, res) => {
    const confirmed = await checkConfirmed(req.session.userId);
    res.send({confirmed: confirmed});
  });
  router.post('/upload-api-key', async (req, res) => {
    const apiKey = req.body.apiKey;
    try {
      const openai = new OpenAI({apiKey: apiKey});
      const engine = await openai.models.list();
      if (engine){
        const result = await uploadAPIKey(req.session.userId, apiKey);
        res.send({apiKeyValid: true});
      }
      else {
        res.send({apiKeyValid: false});
      }
    }
    catch (error) {
      res.send({apiKeyValid: false});
    }
  });
  router.get('/check-api-key', async (req, res) => {
    const apiKey = await readApiKey(req.session.userId);
    try{
      const openai = new OpenAI({apiKey: apiKey});
      const engine = await openai.models.list();
      if (engine) {
        res.send({apiKeyValid: true});
      }
      else{res.send({apiKeyValid: false})};
    }
    catch (error) {
      res.send({apiKeyValid: false});
    }
  });
  router.post('/delete-api-key', async (req, res) => {
    const result = await deleteAPIKey(req.session.userId);
    res.send({apiKeyDeleted: result});
  });
  router.post('/delete-user', async (req, res) => {
    try {
      const result = await deleteUser(req.session.userId);
      req.session.destroy(err => {
        if(!err) {
          res.clearCookie('connect.sid');
          res.send({userDeleted: true});
        }
      });
   
    } catch (error) {
      res.send({userDeleted: false});
    }
  });


  
export default router;