# emails-editor
### [Demo](http://yurgodo.github.io/emails-editor-miro/)
## Setup
 You can use the library by adding ```emails-editor.js``` and ```emails-editor.css``` files from ```src``` folder to your project and import it in the code
## Basic usage
* #### Create instance
	```
    const container = document.querySelector('#emails-editor');
    let emailsEditor = EmailsEditor(container);
    ```
* #### Set emails
   You can set array of emails(string)
	```
    emailsEditor.setEmails([email1, email2, email3]);
    ```
* #### Get emails
	```
    emailsEditor.getEmails() // return array of email object {name, valid}
    ```
* #### Subscribe on email add or remove event
	```
    emailsEditor.setOnAddEmailHandler(callbackFunction(event));
    ```
    or
    ```
    emailsEditor.setOnRemoveEmailHandler(callbackFunction(event));
    ```
    You can use ```event.detail``` to get email name
* #### Valid emails count
	```
    emailsEditor.validEmailsCount()
    ```
* #### Add random valid email
	```
    emailsEditor.addRandomEmail()
    ```
