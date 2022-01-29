import { Selector, ClientFunction } from 'testcafe';

var link = '';

fixture('user')
  .page('http://localhost:3000/#/login')
  .beforeEach(async t => {
    await t
      .typeText('#input-password', 'password')
      .click('#login');
      await t.click('#addNewLink')
      .typeText('#link-input', 'test@yahoo.com')
      .click('#generate');
      link = await Selector('#page-link').innerText;
  });

test('Access the link.', async (t) => {
  await t.navigateTo(link)
  .click('#click-add-file')
    .expect(Selector('#uploading-file').exists)
});

test('Failed upload file and retry',async(t)=>{
  await t.navigateTo(link)
  .click('#upload-file')
  .setFilesToUpload(Selector('input'), '../../client/images/svg/spotFileUpload.svg')
  .click('#upload')
  .click('#retry')
  .expect(Selector('#upload-file')
      .innerText)
    .eql('click to add file');
});

test('Upload success',async(t)=>{
  await t.navigateTo(link)
  .click('#upload-file')
  .setFilesToUpload(Selector('input'), '../../client/files/5b56e929a32d561a98719a2e/mactestFixed.zip')
  .click('#upload')
  .expect(Selector('#success-text')
      .innerText)
    .eql('Your file has been successfully uploaded .');
});

test('Delete file before sending',async(t)=>{
  await t.navigateTo(link)
  .click('#upload-file')
  .setFilesToUpload(Selector('input'), '../../client/images/svg/spotFileUpload.svg')
  .click('#delete-file')
  
});
