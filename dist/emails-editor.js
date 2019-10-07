function EmailsEditor(parentContainer){
    if (!(this instanceof EmailsEditor)) return new EmailsEditor(parentContainer);

    const emailRegExp = ".+@.+\\..+";

    let emails = {};
    let currentInput = setCurrentInput();
    let validEmails = 0;
    let container;

    (function onInit() {
        container = document.createElement("div");
        container.classList.add("emails-editor");
        parentContainer.appendChild(container);
        container.appendChild(currentInput);
        container.onclick = onContainerClick;
    })();

    this.getEmails = () => {
        let emailsArr = [];
        for (let key in emails) {
            emailsArr.push(emails[key]);
        }
        return emailsArr;
    }

    this.setEmails = (emailsArr) => {
        emailsArr.forEach( email => {
            addEmail(email);
        });
    }

    this.validEmailsCount = () => {
        return validEmails;
    }

    this.setOnAddEmailHandler = (func) => {
        container.addEventListener('emailAdd', func);
    }

    this.setOnRemoveEmailHandler = (func) => {
        container.addEventListener('emailRemove', func);
    }

    this.addRandomEmail = () => {
        let randomEmail = `${getRandomString(5, false)}@${getRandomString(5, true)}.${getRandomString(Math.floor(Math.random() * 3) + 2 , true)}`;
        addEmail(randomEmail);
    }

    function onContainerClick(e) {
        currentInput.focus();
    }

    function setCurrentInput() {
        let input = document.createElement("input");
        input.classList.add("current-input");
        input.oninput = onInputHandler;
        input.onkeydown = onInputKeydown;
        input.onkeyup = onInputKeyup;
        input.onblur = onInputBlur;
        input.placeholder = "add more people..."
        return input;
    }

    function isValid(name) {
        let emailRegexp = new RegExp(emailRegExp, "i");
        return emailRegexp.test(name);
    }

    function onInputHandler(e) {
        let currentValue = e.target.value;
        let lastValue = currentValue.slice(-1);
        switch (lastValue) {
            case " ":
            case ",":
                addEmail(currentValue.slice(0, -1));
                this.value = "";
                break;
        }
    }

    function generateID() {
        return `f${(~~(Math.random()*1e8)).toString(16)}`;
    }

    function isEmailExist(value) {
        let isExist = false;
        for (let key in emails){
            if (emails[key].name === value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    function addEmail(name) {
        let value = name.replace(/\s/g, "");
        if (isEmailExist(value) || value.length === 0 || value === ",") {
            return;
        } else {
            let valid = isValid(value);
            let emailObject = {name: value, valid: valid};
            let id = generateID();
            emails[id] = emailObject;
            appendEmail(emailObject, id);
            onEmailAdd(emailObject);
            if (valid) {
                validEmails++;
            }
        }
    }

    function appendEmail(emailObj, id) {
        let emailContainer = document.createElement("span");
        let emailContent = document.createElement("div");
        let emailDelete = document.createElement("div");

        emailContainer.classList.add(emailObj.valid ? "valid" : "invalid", "email");
        emailContainer.setAttribute("id", id);
        emailContent.innerText = emailObj.name;
        emailContent.classList.add("email-content");
        emailDelete.classList.add("email-delete");
        emailDelete.onclick = onEmailDeleteClick;
        emailContainer.appendChild(emailContent);
        emailContainer.appendChild(emailDelete);
        currentInput.before(emailContainer);
    }

    function removeLastEmail() {
        let allEmailNodes = container.querySelectorAll(".email");
        let lastEmail = allEmailNodes.length ? allEmailNodes[allEmailNodes.length-1] : undefined;
        if (lastEmail) {
            removeEmail(lastEmail);
        }
    }

    function removeEmail(node) {
        let id = node.getAttribute("id");
        onEmailRemove(emails[id]);
        if (emails[id].valid) {
            validEmails--;
        }
        delete emails[id];
        node.remove();
    }

    function onInputKeydown(e) {
        let key = e.code;
        let value = e.target.value;
        if(key === "Backspace" && value === "") {
            onInputBackspace();
        }

        if (key === "Enter") {
            addEmail(value);
            this.value = "";
        }
    }

    function onInputKeyup(e) {
        let key = e.code;
        let value = e.target.value;
        if (key === "KeyV" && (e.ctrlKey || e.metaKey)) {
            value.split(',').forEach( email => {
                addEmail(email);
            });
            this.value = "";
        }
    }

    function onInputBlur(e) {
        let value = e.target.value;
        if (value) {
            addEmail(value);
            this.value = "";
        }
    }

    function onEmailDeleteClick(e) {
        removeEmail(e.currentTarget.parentElement);
        e.stopPropagation();
    }

    function onInputBackspace() {
        removeLastEmail();
    }

    function onEmailAdd(email) {
        let widgetEvent = new CustomEvent("emailAdd", {
            bubbles: true,
            detail: email.name
        });
        container.dispatchEvent(widgetEvent);
    }

    function onEmailRemove(email) {
        let widgetEvent = new CustomEvent("emailRemove", {
            bubbles: true,
            detail: email.name
        });
        container.dispatchEvent(widgetEvent);
    }

    function getRandomString(l, isAplhabetical) {
        let numberAndStringChars = '0123456789abcdefghijklmnopqrstuvwxyz';
        let stringChars = 'abcdefghijklmnopqrstuvwxyz';
        let charsLength = isAplhabetical ? stringChars.length : numberAndStringChars.length;
        let chars = isAplhabetical ? stringChars : numberAndStringChars;
        let string = '';
        for(let i=0; i<l; i++) {
            string += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return string;
    }
}