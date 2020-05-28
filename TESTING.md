# Testing Thangs

## Login

Primary path:

1. Log out.
2. Log in.
3. Expect to be logged-in and redirected to your profile page.

Alternative paths:

- Invalid inputs.
- Incorrect credentials.
- Non-existent credentials.

## Signup

Primary path:

1. Log out.
2. Visit sign-up page: /signup/alpha.
3. Fill in sign-up details and submit.
4. Expect to be logged-in as new user and redirected to new (empty) profile page.

Alternative paths:

- Invalid inputs.
- Existing user credentials (email/username).

## Reset password

Primary path:

1. Log out.
2. Visit log-in page: /login.
3. Click the "Forgot your password? Click here to reset your password." link.
4. Enter the email address associated with your account & submit.
5. Check your email inbox for an email containing a reset password link, click link.
6. Enter new password and submit.
7. Expect to be redirected to log-in page, log in with new password.
8. Expect to be logged-in and redirected to your profile page.

Alternative paths:

- Invalid inputs.

## Upload

Primary path:

1. Click Upload Model.
2. Drag & drop model file, fill out required fields.
3. Click Upload.
4. Expect to be redirected to profile page, verify new model card is visible and thumbnail loads after brief moment. [Here’s a gif for reference](https://user-images.githubusercontent.com/169635/83083416-efcda300-a03a-11ea-97b7-025c5f40e0e6.gif).

Alternative paths:

- Invalid inputs.

## Geometrically Similar Models

Primary path:

1. Upload a model, expect to be redirected to profile page.
2. Click on card for new model to visit details page.
3. Under the "Geometrically Similar Models" heading, expect to see "Processing model" message.
4. Expect that after some time (< 15 minutes) this should update and now either display model cards for related results or empty text.

Alternative paths:

- No results.
- Error occurred.

## Search by Model

Primary path:

1. Click Search by Model.
2. Drag & drop model file.
3. Wait for results.
4. Expect to see results page (populated or empty depending on provided model file).

Alternative path:

- Invalid inputs.

## Text search

Primary path:

1. Enter search query into search bar & submit.
2. Expect to see results page (populated or empty depending on search query).

## Edit profile

Primary path:

1. From profile page.
2. Click Edit Profile button.
3. Modify profile fields.
4. Click save.
5. Expect to see save complete successfully and edited fields updated and remain updated after a page refresh.

Alternative paths:

- Invalid inputs.

## Upload profile image

Primary path:

1. From profile page.
2. Click Edit Profile button.
3. Click "Upload New Photo.
4. Select an image from your file-system.
5. Expect to see the crop image modal.
6. Drag squares & move cropping box to frame image as desired.
7. Click "Save" button.
8. Expect profile image to be updated.

Alternative paths:

- Delete profile image.

## Download model

Primary path:

1. Visit model detail page.
2. Click the "Download" button.
3. Expect your browser to download the source model file.


## Comment on model

Primary path:

1. Visit model detail page.
2. Enter a comment in the comment form and submit.
3. Expect to see comment in model's list of comments.

## Like model

Primary path:

1. Visit model detail page.
2. Click "Like" button.
3. Expect to see button text change to "Liked!"
4. Visit profile page & click "Liked" tab.
5. Expect to see model in list of liked models.

## Notifications

Primary path(s):

Model processing complete

- Upload model, once model processing is complete navigate to notifications page: /notifications.
- Expect to see notification indicating model is complete.

Model liked

- Using a different account, like one of your uploaded models.
- While logged in as the owner of the liked model, Expect to see notification about the liked model.
