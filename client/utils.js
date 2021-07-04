function createElement(type, className, content, value) {
    const result = document.createElement(type);
    if (content) {
        result.textContent = content;
    }
    if (value){
        result.value = value;
    }
    if (className) {
        result.className = className;
    }
    return result;
}