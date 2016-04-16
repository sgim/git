'use strict';

/**
* You'll need be installing fvs as a global executable on your machine!
* The steps are below - but go ahead and take some time to try figuring it out on your own!
*
*
* 1. Add the following to your package.json: "bin" : { "fvs" : "./fvs.js" }
* 2. At the top of fvs.js, add #!/usr/bin/env node (this is done for you)
* 3. From your project's root: npm install -g ./
*
**/

/**
* You'll be primarily using fs methods to complete your version control system!
* Please use the synchronous versions of each method - while this is usually
* bad news in the real world, I don't want you to get caught up in callbacks.
* Instead, you can focus on learning the intricacies of Git!
*
* Some useful methods...
*   fs.readFileSync
*   fs.writeFileSync
*   fs.readdirSync
*   fs.rmdirSync
*   fs.mkdirSync
*
* https://nodejs.org/api/fs.html
**/
const fs = require('fs');
const getSha1 = require('./util').getSha1;

/**
  let's write some helper functions!
**/
var objdir = "./.fvs/objects/";
function createFVSObject (fileContents) {
  var hash = getSha1(fileContents);
  var dir = objdir + hash.slice(0, 2);
  var fname = hash.slice(2);
  try {
    fs.readdirSync(dir);
  } catch (e) {
    fs.mkdirSync(dir);
  }
  dir += "/" + fname;
  try {
    fs.readFileSync(dir);
  } catch (e) {
    fs.writeFileSync(dir, fileContents);
  }
  return hash;
}

function createBlobObject (fileName) {
  return createFVSObject(fs.readFileSync(fileName));
}

// NOTE: the index passed in here is an array representing the existing index
// Each entry in the array is a string representing a line in the index.
// This means that you'll actually read the index and turn it into an array before you get here
var indexfile = "./.fvs/index";
function updateIndex (index, fileName, blobRef) {
  var found = false;
  var arr = index.map(idx => idx.split(" ")[0] === fileName ? (found = true && fileName + " " + blobRef): idx).join("\n");
  !found && (arr += fileName + " " + blobRef);
  fs.writeFileSync(indexfile, arr);
  return arr;
}

var fvsdir = "./.fvs/";
module.exports.init = function () {
  try {
    fs.readdirSync(fvsdir);
    throw ".fvs already exists";
  } catch (e) {
    if(typeof e === "string") throw new Error(e);
    fs.mkdirSync(fvsdir);
    fs.mkdirSync(fvsdir + "objects/");
    fs.mkdirSync(fvsdir + "refs/");
    fs.writeFileSync(fvsdir + "refs/master");
    fs.writeFileSync(fvsdir + "HEAD", "ref: refs/master");
  }
};

module.exports.add = function () {
  
  var files = process.argv.slice(3);
  if(!files.length) throw "No filename specified";
  //var arr = files.map(f => createBlobObject(f));
  try {
    fs.readFileSync(indexfile).split("\n");
  } catch (e) {
    fs.writeFileSync(fvsdir + "index", "");
  }
 // var idxNames = arr.map((hash, i) => files[i] + " " + hash).join("\n");
 // fs.writeFileSync(fvsdir + "index", idxNames);
  var blob;
  files.forEach(name => updateIndex(fs.readFileSync(indexfile, "utf8").split("\n"), name, blob = createBlobObject(name)));
   return blob;
  // step 0a. make sure a filename is passed in as an argument
  // step 0b. create the index if none exists
  // step 1: create a 'blob' object in .fvs/objects
  /*
    Hey, remember those functions we wrote earlier...?
  */
  // step 2: add the file to the index
  /*
    You should make sure that the filename includes the path relative to the root directory.
    For example: if your root directory has a directory 'data', which contains 'something.txt'
    your index entry for this file should read data/something.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21.
  */

  // return the value of the added blob's hash!
};

module.exports.commit = function () {
  var message = process.argv[3];
  if(!message) throw "No commit message";

  // step 0a. make sure we have a lovely commit message!

  // step 1. create a tree of the project based on the index
  /*
    For now, I've done this for you! It's not easy!
    If you get done early, check out the specs to implement this on your own!
  */
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRoot = require('./helpers')(index);
  
  // step 2. create a commit object
  // if it's not the first commit, remember to
  // get current branch from HEAD, and get the parent tree from refs
  /*
    A commit object should look like this:

    tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
    author { your name - go ahead and hard code it ;) }
    { your commit message! }

    If there is a parent, it should look like this:

    tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
    author { your name - go ahead and hard code it ;) }
    { your commit message! }
    parent f83b3bff73bd3f3ds212ba0f3bff73bd3f3ds21

    It should still be saved in the objects folder the same way tree and blob objects are saved!
  */

  // step 3. point the current branch at the new commit object

  // return the value of the commit's hash!
};


/**
*
* EXTRA CREDIT (no specs - you're on your own!)
* Don't forget to include these in fvs-cli-helper!
*
**/

module.exports.branch = function () {

  // step 1. get the hash of the current commit from the file pointed to in HEAD

  // step 2. create the branch file at refs/
  // NOTE: in the real Git, this is in refs/heads, but we've simplified it here to just be in refs/

  // return the current commit's hash!
};

// This isn't beyond you, but it's not a piece of cake either!
// You'll need to traverse the tree - feel free to work on this
// or implement the behavior from the ./helpers file.
module.exports.checkout = function () {
  // step 1. get the commit hash that the branch points to

  // step 2. write the contents of the file tree to the working copy

  // step 3. write the file entries to the index

  // step 4. point HEAD at the new branch
};


module.exports.handleDefault = function () {
  throw 'Not a recognized command!';
};

module.exports.createFVSObject = createFVSObject;
module.exports.createBlobObject = createBlobObject;
module.exports.updateIndex = updateIndex;
