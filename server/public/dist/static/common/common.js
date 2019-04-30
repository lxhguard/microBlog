//邮箱
function isMail(mail) {
    var mailreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    if (!mailreg.test(mail)) {
        return false;
    } else {
        return true;
    }
}

//是否在有效范围内(min,max]
function isRange(str, min, max) {
    if (str.length > min && str.length <= max) {
        return true;
    } else {
        return false;
    }
}

export {
    isMail,
    isRange,
}