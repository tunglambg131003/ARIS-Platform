# TO KHANH SPECIFICALLY

# PULL ALL CHANGES BEFORE COMMIT

# important: model use guidelines

## indexedDB

currently, we are using indexedDB to store data locally. this is made possible using the `FilePanel` component in the `EditorCore` general component, which leads to a set of functions in `localdb.js`. they all enable to save **file types** locally, in lieu of localStorage.

todo: migrate these changes to the database for a more sustainable approach.

### usage

first, load the scene in `/test/editor-three`. then, choose to upload a model. upload some more if you want more. adjust the scene necessary, but:

# REMEMBER TO HIT SAVE TO LOCAL

if not, the file simply will not load in the next iterations. also, when you want to start anew:

# REMEMBER TO HIT CLEAR LOCAL

because this will empty out the indexedDB. currently, Zustand is being used as a sort of cache between the actual database and the real database, and this might transfer from now on.

todo: fix the upload to model viewer function because it is uploading a corrupted file.
