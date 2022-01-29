import { Router } from "express";
import { config } from '../config/config';

const linkRoutes: any = Router();
import { LinkController, linkControllerFactory } from '../controllers/link';
import { linkModel, ILinkModel } from '../models/link';
import { Readable } from "stream";

const jwtService = require('../middleware/authentificationMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// injecting the link model in the controller instance
const linkController: LinkController = linkControllerFactory.create(config.mode, linkModel);

linkRoutes.get('/', jwtService.authentication, async (req, res) => {
  try {
    const response: ILinkModel = await linkController.getLinks();
    //send the isExpiredForUser virtual
    const links: JSON = response.toJSON({ virtuals: true });
    res.json(links);
  } catch (err) {
    res.status(500).end();
  }
});


linkRoutes.get('/totalPages', jwtService.authentication, async (req, res) => {
  try {
    //get the total number of items used for pagination
    const response: number = await linkController.getTotaNrOfLinks();
    return res.json(Number(response));
  } catch (err) {
    res.status(500).end();
  }
});

linkRoutes.get('/page/:page', jwtService.authentication, async (req, res) => {
  try {
    const pageNo: number = parseInt(req.params.page);
    const size: number = 20;
    var query: any = {};
    if (pageNo < 0 || pageNo === 0) {
      const response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    const links: ILinkModel[] = await linkController.getPageLinks(query);
    const fullResponse: JSON[] = [];

    links.forEach(element => {
      fullResponse.push(element.toJSON({ virtuals: true }))
    });

    res.json(fullResponse);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});
linkRoutes.get('/:id', async (req, res) => {
  try {
    const requiredLink: ILinkModel = await linkController.getLink(req.params.id);
    const response: JSON = requiredLink.toJSON({ virtuals: true });
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

linkRoutes.post('/', jwtService.authentication, async (req, res) => {
  try {
    const link: ILinkModel = await linkController.addLink(req.body);
    return res.status(201).json(link);
  } catch (err) {
    return res.status(400).end();
  }
});

linkRoutes.post('/upload/:id',
  upload.single('file'),
  async (req, res) => {
    try {
      let updateDate:String = req.body.updateDate;
      let filePath:String = req.body.filePath
      if (req.file) {
        filePath = await linkController.save(req.file, req.params);
      }
      //update filePath and update date
      const updatedLink: ILinkModel = await linkController.updateLink(req.params.id, updateDate, filePath);
      res.json(updatedLink);
    } catch (err) {
      if (err == 'No can do')
        return res.status(400).end();
      console.log(err);
      res.status(500).end();
    }
  });

linkRoutes.get('/download/:fileId', jwtService.authentication, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const requiredLink: ILinkModel = await linkController.getLink(fileId);
    res.attachment(requiredLink.filePath);
    const fileStream: Readable = await linkController.download(fileId);
    console.log(res);
    fileStream.pipe(res);
  } catch (err) {
    res.status(500).end();
  }
});

linkRoutes.put('/:id', jwtService.authentication, async (req, res) => {
  try {
    const updatedLink: ILinkModel = await linkController.updateLink(req.params.id, req.body.updateDate, req.body.filePath);
    res.json(updatedLink);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

linkRoutes.delete('/:id', jwtService.authentication, async (req, res) => {
  try {
    await linkController.deleteLink(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();

  }
});

module.exports = linkRoutes;
