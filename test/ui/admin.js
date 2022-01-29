import { Selector, ClientFunction } from 'testcafe';

var link = '';

fixture('admin')
  .page('http://localhost:3000/#/files')
  .beforeEach(async t => {
    await t
      .typeText('#input-password', 'password')
      .click('#login');
  });

test('The file section is visible.', async (t) => {
  await t.expect(Selector('#showFilesTitle').innerText)
    .eql('Recent Links');
});

test('The new link section is visible.', async (t) => {
  await t.click('#addNewLink')
    .expect(Selector('#title')
      .innerText)
    .eql('New Link :');
});

test('The link is generated.', async (t) => {
  await t.click('#addNewLink')
    .typeText('#link-input', 'test@yahoo.com')
    .click('#generate')
    .expect(Selector('#title-generated')
      .innerText)
    .eql('Link generated :');
});

test('The link was copied to clipboard.', async (t) => {
  const overwriteCopyCommand = ClientFunction(() => {
    document.execCommand = command => window.lastExecutedCommand = command;
  });
  const getLastExecutedCommand = ClientFunction(() => window.lastExecutedCommand);
  await overwriteCopyCommand();
  await t.click('#addNewLink')
    .typeText('#link-input', 'test@yahoo.com')
    .click('#generate')
    .click('#copy-url-link')
    .expect(getLastExecutedCommand()).eql('copy');
});

