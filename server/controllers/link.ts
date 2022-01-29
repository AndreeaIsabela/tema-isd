import { config } from '../config/config';
import { ILinkModel, LinkModel } from '../models/link'
import * as AWS from 'aws-sdk'
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import { Readable } from 'stream';

export class LinkControllerFactory {
  create(mode: String, model: LinkModel) {
    if (mode === 'S3')
      return new LinkControllerS3(model);

    if (mode === 'FS')
      return new LinkControllerFS(model);

    return null;
  }
}
export const linkControllerFactory: LinkControllerFactory = new LinkControllerFactory();

export abstract class LinkController {

  model: LinkModel;
  constructor(linkModel: LinkModel) {
    // inject db model
    this.model = linkModel;
  }

  async getTotaNrOfLinks(): Promise<number> {
    return await this.model.count({});
  }

  async getPageLinks(query): Promise<ILinkModel[]> {
    return await this.model.find().sort({ _id: -1 }).skip(query.skip).limit(query.limit);
  }

  async getLinks(): Promise<ILinkModel> {
    return await this.model.find().sort({ _id: -1 }).lean();
  }

  async getLink(id): Promise<ILinkModel> {
    return await this.model.findOne({ _id: id });
  }

  async addLink(link): Promise<ILinkModel> {
    let newLink: any = new this.model(link);
    return await newLink.save();
  }

  async updateLink(id, updateDate, filePath): Promise<ILinkModel> {
    return await this.model.findOneAndUpdate({ _id: id }, {
      $set: { updateDate: updateDate, filePath: filePath }
    }, { new: true });
  }

  async deleteLink(id): Promise<ILinkModel> {
    return await this.model.findByIdAndRemove({ _id: id });
  }

  abstract async save(file, params): Promise<String>
  abstract async download(file): Promise<Readable>


  protected checkExtension(fname): void {
    const extension = fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2);
    if (extension !== 'zip' && extension !== 'rar' && extension !== '7z') {
      throw 'No can do';
    }
  }

}
export class LinkControllerS3 extends LinkController {
  private s3: AWS.S3;

  constructor(linkModel: LinkModel) {
    super(linkModel);
    // initialized aws
    AWS.config.update({
      accessKeyId: config.S3.accessKeyId,
      secretAccessKey: config.S3.secretAccessKey
    });
    this.s3 = new AWS.S3();
  }
  async save(file, params): Promise<String> {
    const fname: String = file.originalname;
    //get file extension
    this.checkExtension(fname);

    var s3params = {
      Bucket: 'potata',
      Body: fs.createReadStream(file.path),
      Key: "files/" + params.id + '/' + file.originalname
    };
    await this.s3.upload(s3params).promise();
    return s3params.Key; //resp.Location;
  }

  async download(fileId): Promise<Readable> {
    let f: ILinkModel = await this.getLink(fileId);

    const options = {
      Bucket: 'potata',
      Key: f.filePath,
    };
    return this.s3.getObject(options).createReadStream();
  }
}

export class LinkControllerFS extends LinkController {
  constructor(linkModel: LinkModel) {
    super(linkModel);
  }

  async save(file, params): Promise<String> {
    const tmp_path: fs.PathLike = file.path;
    const target_path: String = 'files/' + params.id + '/';
    const savingPath: String = target_path + file.originalname;
    //get file extension
    this.checkExtension(file.originalname);

    //creates a new file with the specified path
    mkdirp('client/' + target_path, (err, res) => {
      if (err) {
        throw 'No can do';
      }
      //copy the file from uploads and put in in target path
      const src: fs.ReadStream = fs.createReadStream(tmp_path);
      const dest: fs.WriteStream = fs.createWriteStream('client/' + savingPath);
      src.pipe(dest);
    });
    return savingPath;
  }
  async download(fileId): Promise<Readable> {
    let f: ILinkModel = await this.getLink(fileId);
    return fs.createReadStream("client/" + f.filePath);
  }
}
