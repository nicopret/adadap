Create a local develop environment for Ethereum

Make sure you have node installed, then just run the create.js file with the directory name you want the local node to use with the number of dummy accounts.

The "password" file is saving the password, this you will need when you want to make any payments on your local node, you can change the password in the file, but "aaa" is pretty easy and quick to use.

Mist should be installed and added to your path, that is the last command that is run and opens Mist with the test accounts.

Will make the file better and must still implement a lot of error handling and child spawning processes, just got in the way of creating some contracts, so will get back to it later. For now, run the create.js file as follows:

node create.js mycoin 10

mycoin is the folder where you want to run the local node from
10 is the number of test accounts that is created, all accounts are created with 10 ethers, this can be changed though.