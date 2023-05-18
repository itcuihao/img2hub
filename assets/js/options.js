const saveOptions = () => {
    const username = document.getElementById('gh-username').value;
    const reponame = document.getElementById('gh-reponame').value;
    const folder = document.getElementById('gh-folder').value;
    const email = document.getElementById('gh-email').value;
    const token = document.getElementById('gh-token').value;
   
  
    chrome.storage.sync.set(
      { ghUsername: username, ghReponame: reponame,ghFolder: folder, ghEmail: email, ghToken: token },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('gh-status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };

  const restoreOptions = () => {
    chrome.storage.sync.get(
        { ghUsername: '', ghReponame: '',ghFolder: '', ghEmail: '', ghToken: '' },
      (items) => {
        document.getElementById('gh-username').value = items.ghUsername;
        document.getElementById('gh-reponame').value = items.ghReponame;
        document.getElementById('gh-folder').value = items.ghFolder;
        document.getElementById('gh-email').value = items.ghEmail;
        document.getElementById('gh-token').value = items.ghToken;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('gh-save').addEventListener('click', saveOptions);